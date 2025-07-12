# 📚 Git推送到Netlify部署完整教程

本教程将指导您如何将Smart-Pic项目推送到Git仓库，并连接到Netlify进行自动部署。

## 🎯 前置准备

### 1. 安装必要工具
- [Git](https://git-scm.com/downloads) - 版本控制工具
- [GitHub](https://github.com) 或 [GitLab](https://gitlab.com) 账户
- [Netlify](https://netlify.com) 账户

### 2. 验证安装
```bash
# 检查Git是否安装成功
git --version
```

## 📁 第一步：初始化Git仓库

### 1. 打开终端/命令行
```bash
# 进入smart-pic项目目录
cd "e:\00 个人项目\00 机理图 - 副本\smart-pic"
```

### 2. 初始化Git仓库
```bash
# 初始化Git仓库
git init

# 添加所有文件到暂存区
git add .

# 创建第一次提交
git commit -m "Initial commit: Smart-Pic Netlify version"
```

## 🌐 第二步：创建远程仓库

### GitHub方式：

1. **登录GitHub**
   - 访问 [github.com](https://github.com)
   - 登录您的账户

2. **创建新仓库**
   - 点击右上角 "+" 号
   - 选择 "New repository"
   - 仓库名称：`smart-pic-netlify`
   - 描述：`AI驱动的智能机理图生成器 - Netlify版本`
   - 选择 "Public" 或 "Private"
   - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

3. **连接本地仓库到GitHub**
```bash
# 添加远程仓库地址（替换YOUR_USERNAME为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/smart-pic-netlify.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

### GitLab方式：

1. **登录GitLab**
   - 访问 [gitlab.com](https://gitlab.com)
   - 登录您的账户

2. **创建新项目**
   - 点击 "New project"
   - 选择 "Create blank project"
   - 项目名称：`smart-pic-netlify`
   - 描述：`AI驱动的智能机理图生成器 - Netlify版本`
   - 选择可见性级别
   - **不要**勾选 "Initialize repository with a README"
   - 点击 "Create project"

3. **连接本地仓库到GitLab**
```bash
# 添加远程仓库地址（替换YOUR_USERNAME为您的GitLab用户名）
git remote add origin https://gitlab.com/YOUR_USERNAME/smart-pic-netlify.git

# 推送代码到GitLab
git branch -M main
git push -u origin main
```

## 🚀 第三步：连接Netlify

### 1. 登录Netlify
- 访问 [netlify.com](https://netlify.com)
- 点击 "Sign up" 或 "Log in"
- 建议使用GitHub/GitLab账户登录（方便后续连接）

### 2. 导入Git项目

#### 方法A：从Git导入
1. 在Netlify控制台点击 "New site from Git"
2. 选择您的Git提供商（GitHub/GitLab/Bitbucket）
3. 授权Netlify访问您的仓库
4. 选择 `smart-pic-netlify` 仓库
5. 配置构建设置：
   - **Branch to deploy**: `main`
   - **Build command**: `echo 'Build completed'`
   - **Publish directory**: `.`
6. 点击 "Deploy site"

#### 方法B：手动部署
1. 在Netlify控制台点击 "Sites"
2. 拖拽整个 `smart-pic` 文件夹到部署区域
3. 等待部署完成

### 3. 配置自定义域名（可选）
1. 在站点设置中点击 "Domain management"
2. 点击 "Add custom domain"
3. 输入您的域名
4. 按照提示配置DNS记录

## ⚙️ 第四步：环境变量配置（可选）

如果需要修改API密钥或其他配置：

1. **在Netlify控制台**
   - 进入您的站点设置
   - 点击 "Environment variables"
   - 添加环境变量：
     ```
     ANTHROPIC_AUTH_TOKEN=your_api_key_here
     ANTHROPIC_BASE_URL=https://claucode.com
     ```

2. **修改函数代码**（如果使用环境变量）
```javascript
// 在 netlify/functions/generate-xml.js 中
const ANTHROPIC_AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN || "默认密钥";
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || "https://claucode.com";
```

## 🔄 第五步：自动部署设置

### 1. 启用自动部署
- 在Netlify站点设置中，"Build & deploy" 部分
- 确保 "Auto publishing" 已启用
- 每次推送到main分支都会自动触发部署

### 2. 部署钩子（Webhook）
- 在 "Build hooks" 中可以创建自定义部署触发器
- 获取Webhook URL用于外部触发部署

## 📝 第六步：日常开发流程

### 1. 修改代码
```bash
# 修改文件后
git add .
git commit -m "描述您的更改"
git push origin main
```

### 2. 查看部署状态
- 在Netlify控制台查看部署日志
- 每次推送后会自动触发新的部署

### 3. 回滚版本（如需要）
- 在Netlify控制台的 "Deploys" 页面
- 选择之前的部署版本
- 点击 "Publish deploy" 进行回滚

## 🛠️ 故障排除

### 常见问题：

1. **推送失败**
```bash
# 如果遇到推送问题，先拉取远程更改
git pull origin main
# 解决冲突后再推送
git push origin main
```

2. **部署失败**
- 检查Netlify部署日志
- 确认所有文件都已正确推送
- 检查package.json中的依赖是否正确

3. **函数错误**
- 查看Netlify Functions日志
- 确认API密钥配置正确
- 检查函数代码语法

4. **CORS错误**
- 确认_redirects文件配置正确
- 检查函数中的CORS头设置

## 📊 监控和分析

### 1. Netlify Analytics
- 在站点设置中启用Analytics
- 查看访问量、性能指标等

### 2. 函数使用情况
- 在 "Functions" 页面查看调用次数
- 监控函数执行时间和错误率

## 🎉 完成！

恭喜！您已经成功将Smart-Pic项目部署到Netlify。现在您可以：

- ✅ 通过Netlify提供的URL访问应用
- ✅ 享受自动部署的便利
- ✅ 使用无服务器函数处理API请求
- ✅ 获得免费的HTTPS证书
- ✅ 利用Netlify的CDN加速

## 📞 获取帮助

如果遇到问题，可以：
- 查看 [Netlify文档](https://docs.netlify.com/)
- 访问 [Netlify社区](https://community.netlify.com/)
- 查看项目的GitHub Issues

---

**作者**: LaVine  
**项目**: Smart-Pic  
**版本**: 1.0.0  
**更新时间**: 2025年1月