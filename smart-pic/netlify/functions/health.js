exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'OK',
      message: 'Smart-Pic服务运行正常',
      version: '1.0.0',
      author: 'LaVine'
    })
  };
}; 