# Smart-Pic - AI驱动的智能机理图生成器

## 项目说明
这是一个基于React的Web应用，用于生成和展示机理图。项目使用React作为前端框架，Netlify Functions作为后端服务。

## 部署说明

### 环境要求
- Node.js 18.x 或更高版本
- npm 8.x 或更高版本

### 本地开发
1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

### 生产环境部署
1. 构建项目：
```bash
npm run build
```

2. 部署到Netlify：
- 将代码推送到GitHub仓库
- 在Netlify中连接GitHub仓库
- Netlify会自动触发构建和部署

### 项目结构
- `build/` - 生产环境构建文件
- `src/` - React源代码
- `netlify/functions/` - Netlify serverless functions
- `public/` - 静态资源文件

### 环境变量
请确保在Netlify的环境变量中设置以下值：
- `ANTHROPIC_API_KEY` - Anthropic API密钥

## 技术栈
- React 18
- Express.js
- Netlify Functions
- Anthropic API

## 许可证
MIT License 