# Smart-Pic - Netlify部署版本

🚀 AI驱动的智能机理图生成器 - 专为Netlify部署优化

## 📋 项目简介

Smart-Pic是一个基于AI的智能机理图生成工具，能够根据文字描述自动生成DrawIO格式的机理图XML代码。本版本专门为Netlify平台部署进行了优化。

## 🌟 主要特性

- ✅ AI驱动的智能图表生成
- ✅ 支持DrawIO格式输出
- ✅ 无服务器架构（Netlify Functions）
- ✅ 响应式Web界面
- ✅ 一键部署到Netlify

## 🚀 快速部署

### 方法1：一键部署

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/LaVineLeo/smart-pic)

### 方法2：手动部署

1. **克隆或下载项目**
   ```bash
   git clone <your-repo-url>
   cd smart-pic
   ```

2. **登录Netlify**
   - 访问 [netlify.com](https://netlify.com)
   - 注册/登录账户

3. **部署项目**
   - 拖拽整个 `smart-pic` 文件夹到Netlify部署区域
   - 或者连接Git仓库进行自动部署

4. **配置环境变量**（可选）
   - 在Netlify控制台中设置环境变量
   - 可以修改API密钥等配置

## 📁 项目结构

```
smart-pic/
├── index.html              # 主页面
├── static/                 # 静态资源
│   ├── css/               # 样式文件
│   └── js/                # JavaScript文件
├── netlify/
│   └── functions/         # Netlify函数
│       ├── generate-xml.js # XML生成API
│       └── health.js      # 健康检查API
├── netlify.toml           # Netlify配置
├── _redirects             # 路由重定向规则
├── package.json           # 项目依赖
└── README.md              # 说明文档
```

## 🔧 API接口

### 生成XML
- **端点**: `POST /api/generate-xml`
- **参数**: `{ "description": "机理图描述" }`
- **返回**: `{ "xml": "DrawIO XML代码", "original_response": "AI原始响应" }`

### 健康检查
- **端点**: `GET /api/health`
- **返回**: `{ "status": "OK", "message": "服务状态", "version": "1.0.0" }`

## 🛠️ 本地开发

1. **安装Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **启动本地开发服务器**
   ```bash
   netlify dev
   ```

3. **访问应用**
   - 打开浏览器访问 `http://localhost:8888`

## 📝 使用说明

1. 打开部署后的网站
2. 在输入框中描述你想要生成的机理图
3. 点击"生成机理图"按钮
4. 等待AI生成XML代码
5. 复制生成的XML代码到DrawIO中使用

## 🔒 安全说明

- API密钥已内置在函数中，生产环境建议使用环境变量
- 所有API请求都经过CORS配置
- 支持HTTPS安全传输

## 👨‍💻 作者信息

- **作者**: LaVine
- **GitHub**: [LaVineLeo](https://github.com/LaVineLeo)
- **版本**: 1.0.0

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目！

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！