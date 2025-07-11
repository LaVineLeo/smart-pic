import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DrawIOViewer from './components/DrawIOViewer';
import './App.css';

// 防抖函数
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function App() {
  const [description, setDescription] = useState('');
  const [xmlCode, setXmlCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('code'); // 'code' | 'preview' | 'split'
  const [autoPreview, setAutoPreview] = useState(true);
  const [apiKey, setApiKey] = useState(localStorage.getItem('anthropicApiKey') || '');
  const [showApiConfig, setShowApiConfig] = useState(!localStorage.getItem('anthropicApiKey'));

  // 从localStorage加载保存的状态
  useEffect(() => {
    const savedDescription = localStorage.getItem('smartPicDescription');
    const savedXmlCode = localStorage.getItem('smartPicXmlCode');
    const savedViewMode = localStorage.getItem('smartPicViewMode');
    
    if (savedDescription) setDescription(savedDescription);
    if (savedXmlCode) setXmlCode(savedXmlCode);
    if (savedViewMode) setViewMode(savedViewMode);
  }, []);

  // 保存状态到localStorage
  useEffect(() => {
    localStorage.setItem('smartPicDescription', description);
    localStorage.setItem('smartPicXmlCode', xmlCode);
    localStorage.setItem('smartPicViewMode', viewMode);
  }, [description, xmlCode, viewMode]);

  // 保存API Key
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('anthropicApiKey', apiKey.trim());
      setShowApiConfig(false);
    }
  };

  // 防抖处理的生成函数
  const debouncedGenerate = useCallback(
    debounce(async (text) => {
      if (!text.trim()) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.post('/.netlify/functions/generate-xml', {
          description: text
        });
        setXmlCode(response.data.xml);
        showToast('✨ 预览已更新');
        setViewMode('preview');
      } catch (err) {
        setError('生成失败，请稍后重试: ' + (err.response?.data?.error || err.message));
        console.error('预览生成失败:', err);
      } finally {
        setLoading(false);
      }
    }, 1000),
    []
  );

  // 处理输入变化
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    
    // 如果启用了自动预览，触发防抖生成
    if (autoPreview && newDescription.trim()) {
      debouncedGenerate(newDescription);
    }
  };

  // 显示Toast提示
  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const generateXML = async () => {
    if (!description.trim()) {
      setError('请输入机理图描述');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/.netlify/functions/generate-xml', {
        description: description
      });
      
      setXmlCode(response.data.xml);
      setViewMode('preview');
    } catch (err) {
      setError('生成失败，请稍后重试: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadXML = () => {
    if (!xmlCode) return;
    
    const blob = new Blob([xmlCode], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart-pic-diagram.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(xmlCode);
    // 创建一个简单的成功提示
    const notification = document.createElement('div');
    notification.textContent = '✓ XML代码已复制到剪贴板';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--success);
      color: var(--primary-bg);
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const examples = [
    {
      title: "🔄 智能流程图",
      description: "创建一个智能工作流程图，包含数据输入、AI处理、决策判断、结果输出四个关键节点，用科技感的连线展示数据流向"
    },
    {
      title: "🏗️ 系统架构图", 
      description: "设计现代化微服务架构图，包含前端应用、API网关、微服务集群、数据库层，展示分布式系统的完整架构"
    },
    {
      title: "🌳 AI决策树",
      description: "构建机器学习决策树模型，从根节点开始分析特征，通过多层分支判断，最终到达分类结果的叶子节点"
    }
  ];

  return (
    <div className="App">
      {showApiConfig && (
        <div className="api-config-overlay">
          <div className="api-config-modal">
            <h2>配置API Key</h2>
            <p>请输入您的Anthropic API Key以继续使用</p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="api-key-input"
            />
            <button onClick={saveApiKey} disabled={!apiKey.trim()}>
              保存
            </button>
          </div>
        </div>
      )}
      
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/icon.png" alt="Smart-Pic Logo" className="app-logo" />
            <div className="brand-info">
              <h1>
                <span className="title-smart" data-text="Smart">Smart</span>
                <span className="title-separator">-</span>
                <span className="title-pic" data-text="Pic">Pic</span>
              </h1>
              <p className="subtitle">AI驱动的智能机理图生成器</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="api-config-button"
              onClick={() => setShowApiConfig(true)}
              title="配置API Key"
            >
              ⚙️
            </button>
            <div className="tech-badge">
              <span>🤖</span>
              <span>Powered by Claude Sonnet 4</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="input-section animate-float">
          {/* 添加科技线条背景 */}
          <div className="tech-lines">
            <div className="tech-line"></div>
            <div className="tech-line"></div>
            <div className="tech-line"></div>
            <div className="tech-line"></div>
          </div>
          
          {/* 添加轮廓动画元素 */}
          <div className="tech-outline"></div>
          
          <h2>
            <span>✨</span>
            描述您的机理图需求
            <div className="auto-preview-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={autoPreview}
                  onChange={(e) => setAutoPreview(e.target.checked)}
                />
                实时预览
              </label>
            </div>
          </h2>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="请详细描述您想要创建的机理图，例如：&#10;&#10;创建一个智能数据处理流程图，包含数据采集、预处理、AI分析、结果可视化四个模块，每个模块用现代化的图形表示，用流畅的连线展示数据流向和处理逻辑..."
            rows={6}
            className="description-input"
          />
          
          <div className="examples-section">
            <h3>
              <span>💡</span>
              创意示例
            </h3>
            <div className="examples-grid">
              {examples.map((example, index) => (
                <div key={index} className="example-card" onClick={() => setDescription(example.description)}>
                  <h4>{example.title}</h4>
                  <p>{example.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="button-group">
            <button 
              onClick={generateXML} 
              disabled={loading || !description.trim()}
              className="generate-btn animate-glow"
            >
              {loading ? (
                <>
                  <span>🔄</span>
                  <span>AI正在生成中...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>生成智能图表</span>
                </>
              )}
            </button>
            
            {xmlCode && (
              <>
                <button onClick={copyToClipboard} className="copy-btn">
                  <span>📋</span>
                  <span>复制代码</span>
                </button>
                <button onClick={downloadXML} className="download-btn">
                  <span>💾</span>
                  <span>下载文件</span>
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="error-message">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {xmlCode && (
          <div className="output-section">
            <div className="output-header">
              <h2>
                <span>📊</span>
                生成结果
              </h2>
              <div className="view-mode-controls">
                <button 
                  className={`view-mode-btn ${viewMode === 'code' ? 'active' : ''}`}
                  onClick={() => setViewMode('code')}
                >
                  <span>💻</span>
                  代码视图
                </button>
                <button 
                  className={`view-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
                  onClick={() => setViewMode('preview')}
                >
                  <span>👁️</span>
                  预览视图
                </button>
                <button 
                  className={`view-mode-btn ${viewMode === 'split' ? 'active' : ''}`}
                  onClick={() => setViewMode('split')}
                >
                  <span>⚡</span>
                  分屏视图
                </button>
              </div>
            </div>

            <div className={`output-content ${viewMode}`}>
              {(viewMode === 'code' || viewMode === 'split') && (
                <div className="code-section">
                  <h3>
                    <span>📝</span>
                    DrawIO XML代码
                  </h3>
                  <div className="code-container">
                    <SyntaxHighlighter 
                      language="xml" 
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0',
                        fontSize: '14px',
                        background: 'var(--secondary-bg)',
                      }}
                      showLineNumbers={true}
                      wrapLines={true}
                    >
                      {xmlCode}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}

              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className="preview-section">
                  <DrawIOViewer 
                    xmlData={xmlCode} 
                    isVisible={viewMode === 'preview' || viewMode === 'split'} 
                  />
                </div>
              )}
            </div>
            
            <div className="usage-instructions">
              <h3>
                <span>🎯</span>
                使用指南
              </h3>
              <ol>
                <li><strong>智能预览:</strong> 在预览模式中实时查看生成的图表效果</li>
                <li><strong>代码查看:</strong> 在代码模式中检查和复制生成的XML代码</li>
                <li><strong>分屏模式:</strong> 同时查看代码和预览，便于调试和学习</li>
                <li><strong>进阶编辑:</strong> 复制XML代码到 <a href="https://app.diagrams.net/" target="_blank" rel="noopener noreferrer">draw.io</a> 进行专业编辑</li>
                <li><strong>一键下载:</strong> 直接下载XML文件，快速集成到您的项目中</li>
              </ol>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-author">
            <span>👨‍💻</span>
            <span>Created by <strong>LaVine</strong></span>
          </div>
          <div>
            <span>🔧</span>
            <span>AI驱动 | DrawIO兼容 | 实时预览</span>
          </div>
          <div>
            <span>⭐</span>
            <a href="https://github.com/LaVineLeo" target="_blank" rel="noopener noreferrer" className="footer-github">
              GitHub @LaVineLeo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 