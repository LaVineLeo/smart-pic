# Smart-Pic - AI驱动的智能机理图生成器

Smart-Pic是一个基于AI的智能机理图生成器，它可以将文本描述转换为专业的机理图。该项目使用React构建前端界面，并通过Netlify Functions集成Claude AI来生成图表。

## 特性

- 🤖 AI驱动的图表生成
- 📊 实时预览生成的图表
- 💾 支持下载XML格式的图表文件
- 🎨 美观的用户界面
- 🚀 基于Netlify部署

## 本地开发

1. 克隆仓库
```bash
git clone https://github.com/yourusername/smart-pic.git
cd smart-pic
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
在项目根目录创建`.env`文件：
```
ANTHROPIC_AUTH_TOKEN=your_api_key
ANTHROPIC_BASE_URL=https://claucode.com
```

4. 启动开发服务器
```bash
npm run dev
```

## 部署

项目已配置为可以直接部署到Netlify。只需要：

1. 在Netlify中创建新项目
2. 连接到GitHub仓库
3. 配置环境变量：
   - `ANTHROPIC_AUTH_TOKEN`
   - `ANTHROPIC_BASE_URL`
4. 部署！

## 技术栈

- React
- Netlify Functions
- Claude AI
- Draw.io Viewer

## 许可证

MIT

## 作者

LaVine

## 贡献

欢迎提交Issue和Pull Request！ 