# ⚙️ Smart-Pic 参数配置指南

本指南详细说明了Smart-Pic项目中各种参数的配置方法，包括环境变量、API配置、Netlify设置等。

## 📋 目录

1. [环境变量配置](#环境变量配置)
2. [API参数设置](#api参数设置)
3. [Netlify配置参数](#netlify配置参数)
4. [函数参数调优](#函数参数调优)
5. [前端配置参数](#前端配置参数)
6. [安全参数设置](#安全参数设置)

## 🌍 环境变量配置

### 1. Netlify环境变量设置

在Netlify控制台中设置环境变量：

**路径**: Site Settings → Environment variables → Add variable

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `ANTHROPIC_AUTH_TOKEN` | Anthropic API密钥 | 内置密钥 | 是 |
| `ANTHROPIC_BASE_URL` | API基础URL | `https://claucode.com` | 否 |
| `NODE_ENV` | 运行环境 | `production` | 否 |
| `MAX_TOKENS` | AI响应最大token数 | `4000` | 否 |
| `TIMEOUT_MS` | API超时时间(毫秒) | `30000` | 否 |

### 2. 本地开发环境变量

创建 `.env` 文件（仅用于本地开发）：

```bash
# .env 文件内容
ANTHROPIC_AUTH_TOKEN=your_api_key_here
ANTHROPIC_BASE_URL=https://claucode.com
NODE_ENV=development
MAX_TOKENS=4000
TIMEOUT_MS=30000
```

**注意**: 不要将 `.env` 文件提交到Git仓库！

### 3. 在函数中使用环境变量

修改 `netlify/functions/generate-xml.js`：

```javascript
// 使用环境变量
const ANTHROPIC_AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN || "默认密钥";
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || "https://claucode.com";
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS) || 4000;
const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS) || 30000;
```

## 🔌 API参数设置

### 1. Anthropic API配置

在 `netlify/functions/generate-xml.js` 中配置：

```javascript
const apiConfig = {
  // 模型选择
  model: 'claude-sonnet-4-20250514', // 可选: claude-3-haiku-20240307, claude-3-sonnet-20240229
  
  // 响应长度控制
  max_tokens: MAX_TOKENS, // 建议: 2000-8000
  
  // 温度参数 (创造性控制)
  temperature: 0.7, // 范围: 0.0-1.0, 越高越有创造性
  
  // Top-p采样
  top_p: 0.9, // 范围: 0.0-1.0
  
  // API版本
  anthropic_version: '2023-06-01'
};
```

### 2. 请求超时设置

```javascript
// 在API调用中设置超时
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

const response = await fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(requestBody),
  signal: controller.signal
});

clearTimeout(timeoutId);
```

### 3. 重试机制配置

```javascript
const retryConfig = {
  maxRetries: 3,           // 最大重试次数
  retryDelay: 1000,        // 重试延迟(毫秒)
  backoffMultiplier: 2     // 退避倍数
};
```

## 🚀 Netlify配置参数

### 1. netlify.toml 配置

```toml
[build]
  publish = "."                    # 发布目录
  functions = "netlify/functions"   # 函数目录
  command = "echo 'Build completed'" # 构建命令

[build.environment]
  NODE_VERSION = "18"              # Node.js版本
  NPM_VERSION = "8"                # NPM版本

# 函数配置
[functions]
  directory = "netlify/functions"
  
# 单个函数配置
[functions."generate-xml"]
  timeout = 30                     # 函数超时时间(秒)
  memory = 1024                    # 内存限制(MB)
  
[functions."health"]
  timeout = 10
  memory = 512

# 重定向规则
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
  force = true                     # 强制重定向

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["admin"]}  # 条件重定向

# 头部设置
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
    Cache-Control = "no-cache"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. _redirects 文件配置

```
# API重定向
/api/generate-xml  /.netlify/functions/generate-xml  200
/api/health        /.netlify/functions/health        200

# 带参数的重定向
/api/v1/*          /.netlify/functions/:splat         200

# 条件重定向
/admin/*           /login.html                       302  Role=visitor

# 地理位置重定向
/                  /cn/index.html                    302  Country=cn

# SPA回退
/*                 /index.html                       200
```

## ⚡ 函数参数调优

### 1. 性能优化参数

```javascript
// 在函数开头设置
const performanceConfig = {
  // 连接池设置
  keepAlive: true,
  maxSockets: 10,
  
  // 缓存设置
  enableCache: true,
  cacheTimeout: 300000, // 5分钟
  
  // 压缩设置
  enableGzip: true,
  compressionLevel: 6
};
```

### 2. 错误处理参数

```javascript
const errorConfig = {
  // 错误重试
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
  
  // 错误日志
  enableLogging: true,
  logLevel: 'error', // 'debug', 'info', 'warn', 'error'
  
  // 错误响应
  includeStackTrace: false, // 生产环境设为false
  customErrorMessages: {
    'TIMEOUT': '请求超时，请稍后重试',
    'API_ERROR': 'API服务暂时不可用',
    'INVALID_INPUT': '输入参数无效'
  }
};
```

### 3. 安全参数

```javascript
const securityConfig = {
  // CORS设置
  allowedOrigins: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  allowedMethods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  // 速率限制
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 最大请求数
    message: '请求过于频繁，请稍后重试'
  },
  
  // 输入验证
  validation: {
    maxDescriptionLength: 2000,
    allowedCharacters: /^[\u4e00-\u9fa5a-zA-Z0-9\s\.,!?;:()\-_]+$/,
    forbiddenWords: ['script', 'eval', 'function']
  }
};
```

## 🎨 前端配置参数

### 1. API调用配置

在前端JavaScript中：

```javascript
const frontendConfig = {
  // API端点
  apiBaseUrl: window.location.origin,
  apiEndpoints: {
    generateXml: '/api/generate-xml',
    health: '/api/health'
  },
  
  // 请求配置
  requestTimeout: 30000,
  retryAttempts: 2,
  retryDelay: 2000,
  
  // UI配置
  ui: {
    showLoadingSpinner: true,
    loadingText: '正在生成机理图...',
    successMessage: '生成成功！',
    errorMessage: '生成失败，请重试'
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    maxAge: 300000, // 5分钟
    maxSize: 50 // 最大缓存条目数
  }
};
```

### 2. 用户体验参数

```javascript
const uxConfig = {
  // 防抖设置
  debounceDelay: 500,
  
  // 自动保存
  autoSave: {
    enabled: true,
    interval: 30000 // 30秒
  },
  
  // 主题设置
  theme: {
    default: 'light',
    allowUserChange: true,
    persistPreference: true
  },
  
  // 语言设置
  language: {
    default: 'zh-CN',
    supported: ['zh-CN', 'en-US'],
    autoDetect: true
  }
};
```

## 🔒 安全参数设置

### 1. API密钥管理

```bash
# 生产环境 - 在Netlify中设置
ANTHROPIC_AUTH_TOKEN=sk-your-production-key

# 开发环境 - 在.env文件中设置
ANTHROPIC_AUTH_TOKEN=sk-your-development-key

# 测试环境
ANTHROPIC_AUTH_TOKEN=sk-your-test-key
```

### 2. 访问控制参数

```javascript
const accessControl = {
  // IP白名单
  allowedIPs: ['127.0.0.1', '::1'],
  
  // 用户代理检查
  allowedUserAgents: [/Mozilla/, /Chrome/, /Safari/],
  
  // 请求头验证
  requiredHeaders: ['Content-Type'],
  
  // 请求大小限制
  maxRequestSize: 1024 * 1024, // 1MB
  
  // 会话管理
  session: {
    timeout: 3600000, // 1小时
    renewOnActivity: true
  }
};
```

### 3. 数据保护参数

```javascript
const dataProtection = {
  // 数据加密
  encryption: {
    algorithm: 'aes-256-gcm',
    keyRotationInterval: 86400000 // 24小时
  },
  
  // 日志脱敏
  logging: {
    maskSensitiveData: true,
    sensitiveFields: ['token', 'password', 'email'],
    retentionPeriod: 2592000000 // 30天
  },
  
  // 数据清理
  cleanup: {
    enabled: true,
    interval: 3600000, // 1小时
    maxAge: 86400000 // 24小时
  }
};
```

## 📊 监控参数设置

### 1. 性能监控

```javascript
const monitoring = {
  // 性能指标
  performance: {
    trackResponseTime: true,
    trackMemoryUsage: true,
    trackCPUUsage: true,
    alertThresholds: {
      responseTime: 5000, // 5秒
      memoryUsage: 0.8,   // 80%
      errorRate: 0.05     // 5%
    }
  },
  
  // 错误追踪
  errorTracking: {
    enabled: true,
    sampleRate: 1.0,
    includeStackTrace: true,
    notificationChannels: ['email', 'slack']
  },
  
  // 用户分析
  analytics: {
    trackUserBehavior: true,
    trackConversions: true,
    privacyCompliant: true
  }
};
```

## 🔧 调试参数

### 1. 开发模式设置

```javascript
const debugConfig = {
  // 调试模式
  debug: process.env.NODE_ENV === 'development',
  
  // 详细日志
  verbose: true,
  
  // 模拟延迟
  simulateDelay: {
    enabled: false,
    min: 1000,
    max: 3000
  },
  
  // 模拟错误
  simulateErrors: {
    enabled: false,
    probability: 0.1 // 10%概率
  }
};
```

## 📝 配置验证

### 1. 参数验证函数

```javascript
function validateConfig(config) {
  const errors = [];
  
  // 验证必需参数
  if (!config.ANTHROPIC_AUTH_TOKEN) {
    errors.push('ANTHROPIC_AUTH_TOKEN is required');
  }
  
  // 验证数值范围
  if (config.MAX_TOKENS < 100 || config.MAX_TOKENS > 8000) {
    errors.push('MAX_TOKENS must be between 100 and 8000');
  }
  
  // 验证URL格式
  if (config.ANTHROPIC_BASE_URL && !isValidUrl(config.ANTHROPIC_BASE_URL)) {
    errors.push('ANTHROPIC_BASE_URL must be a valid URL');
  }
  
  return errors;
}
```

## 🚨 常见配置问题

### 1. 环境变量未生效
- 检查变量名拼写
- 确认在正确的环境中设置
- 重新部署应用

### 2. API调用失败
- 验证API密钥有效性
- 检查网络连接
- 确认API端点URL正确

### 3. 函数超时
- 增加timeout参数
- 优化代码性能
- 检查外部API响应时间

### 4. CORS错误
- 检查_redirects文件配置
- 确认函数中的CORS头设置
- 验证域名白名单

---

**提示**: 修改配置后记得重新部署应用以使更改生效！

**作者**: LaVine  
**项目**: Smart-Pic  
**版本**: 1.0.0  
**更新时间**: 2025年1月