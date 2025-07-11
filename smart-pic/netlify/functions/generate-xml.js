const fetch = require('node-fetch');

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

请根据以下需求生成DrawIO XML代码：
`;

// 调用Anthropic API
async function callAnthropicAPI(prompt) {
  try {
    const response = await fetch(`${process.env.ANTHROPIC_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_AUTH_TOKEN,
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
  const xmlMatch = response.match(/```xml\n([\s\S]*?)\n```/) || 
                   response.match(/```\n([\s\S]*?)\n```/) ||
                   response.match(/<\?xml[\s\S]*?<\/mxfile>/);
  
  if (xmlMatch) {
    return xmlMatch[1] || xmlMatch[0];
  }
  
  if (response.includes('<?xml') && response.includes('</mxfile>')) {
    const start = response.indexOf('<?xml');
    const end = response.lastIndexOf('</mxfile>') + 9;
    return response.substring(start, end);
  }
  
  return response;
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: '只支持POST请求' })
    };
  }

  try {
    const { description } = JSON.parse(event.body);
    
    if (!description) {
      return {
        statusCode: 400,
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        xml: xmlCode,
        original_response: aiResponse
      })
    };
    
  } catch (error) {
    console.error('XML生成错误:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: '生成失败: ' + error.message 
      })
    };
  }
}; 