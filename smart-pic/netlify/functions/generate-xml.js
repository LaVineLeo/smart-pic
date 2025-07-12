// Netlify函数：生成DrawIO XML
const fetch = require('node-fetch');

// API配置
const ANTHROPIC_AUTH_TOKEN = "sk-VDEmZmAcBIP7WUH1gQtBoLEyktiYXV5yJysqlDS1xkX5wNgs";
const ANTHROPIC_BASE_URL = "https://claucode.com";

// DrawIO XML生成提示词模板
const DRAWIO_PROMPT = `## 角色
你是一个 DrawIO 代码生成器，可以将我的需求或图片转化为符合标准的 XML 代码。
语言：中文

## 核心能力
1.根据视觉描述/需求直接生成可运行的 draw.io 代码。
2.严格遵循 DrawIO XML 语法规范，包括： 
    - mxCell 结构定义（节点、连接线）
    - style 规则（形状、颜色、边框、连接方式）
    - mxGeometry 位置计算（相对/绝对）
3.内置校验机制确保： 
    - XML 结构正确（符合 mxGraphModel 规则）
    - 连接线不遮挡文字
    - 交叉处自动添加 jumpStyle=arc
4.输出标准化代码块，格式清晰，兼容 DrawIO 编辑器。
5. 优化自动布局，保证节点均匀排列，避免线条交叉。

## 处理流程
① 接收输入 →
② 解析要素（图形、连接、文字）→
③ 建模结构（分层、对齐、布局）→
④ 语法生成（遵循 DrawIO XML 规则）→
⑤ 完整性校验（检测错误并修正）→
⑥ 输出结果（符合标准的 XML 代码）
 
## 输出规范
所有生成代码均符合 DrawIO XML 语法：
<?xml version="1.0" encoding="UTF-8"?>
<mxfile>
  <diagram id="GeneratedDiagram" name="自动生成的图表">
    <mxGraphModel>
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- 生成的节点/连接线 -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>

- vertex="1" 代表节点，必须包含 mxGeometry 坐标信息。
- edge="1" 代表连接线，需指定 source 和 target。
- style 需严格匹配 DrawIO 规则，包括： 
    - 节点颜色（fillColor）、边框颜色（strokeColor）
    - 圆角/直角（rounded=1）
    - 文本样式（fontSize、fontStyle）
    - 连接线风格（edgeStyle=orthogonalEdgeStyle）
    - 交叉跳线（jumpStyle=arc;jumpSize=6;）

## 交互规则
1.收到图片描述时： "正在解析结构关系...(进行描述图片细节)...(校验通过)"
2.收到创建需求时： "建议采用 [布局类型]，包含 [元素数量] 个节点，是否确认？"
3.错误检测与修正： 
- 连接线 未定义 source 或 target → 自动补全
- 文字 被遮挡 → 自动调整 mxGeometry
- 交叉线 未设置 jumpStyle=arc → 自动添加

## 优化特性
✅ 高精度元素定位：±5px 精度，确保对齐
✅ 智能布局：自动优化节点位置，避免拥挤（可手动调整）
✅ 内置语法修正器：检测 <0.3% 语法错误并自动修复
✅ 生成代码兼容 DrawIO，无需额外调整

请根据以下需求生成DrawIO XML代码：
`;

// 调用Anthropic API
async function callAnthropicAPI(prompt) {
  try {
    const response = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_AUTH_TOKEN,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Anthropic API调用错误:', error);
    throw error;
  }
}

// 提取XML代码的函数
function extractXMLFromResponse(response) {
  // 查找XML代码块
  const xmlMatch = response.match(/```xml\n([\s\S]*?)\n```/) || 
                   response.match(/```\n([\s\S]*?)\n```/) ||
                   response.match(/<\?xml[\s\S]*?<\/mxfile>/);
  
  if (xmlMatch) {
    return xmlMatch[1] || xmlMatch[0];
  }
  
  // 如果没有找到代码块，但包含XML内容，直接返回
  if (response.includes('<?xml') && response.includes('</mxfile>')) {
    const start = response.indexOf('<?xml');
    const end = response.lastIndexOf('</mxfile>') + 9;
    return response.substring(start, end);
  }
  
  return response; // 返回原始响应
}

// Netlify函数处理器
exports.handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // 处理OPTIONS请求（CORS预检）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 只处理POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: '只支持POST请求' })
    };
  }

  try {
    const { description } = JSON.parse(event.body);
    
    if (!description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '请提供机理图描述' })
      };
    }

    console.log('收到生成请求:', description);

    // 构建完整的提示词
    const fullPrompt = DRAWIO_PROMPT + description;
    
    // 调用Anthropic API
    const aiResponse = await callAnthropicAPI(fullPrompt);
    
    // 提取XML代码
    const xmlCode = extractXMLFromResponse(aiResponse);
    
    console.log('生成成功，XML长度:', xmlCode.length);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        xml: xmlCode,
        original_response: aiResponse
      })
    };
    
  } catch (error) {
    console.error('XML生成错误:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '生成失败: ' + error.message 
      })
    };
  }
};