// Netlify函数：健康检查
exports.handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // 只处理GET请求
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: '只支持GET请求' })
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      status: 'OK', 
      message: 'Smart-Pic服务运行正常', 
      version: '1.0.0', 
      author: 'LaVine',
      platform: 'Netlify'
    })
  };
};