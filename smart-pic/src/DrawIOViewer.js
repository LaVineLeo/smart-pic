import React, { useEffect, useRef, useState } from 'react';
import './DrawIOViewer.css';

const DrawIOViewer = ({ xmlData, isVisible }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!xmlData || !isVisible) return;

    const loadDiagram = () => {
      try {
        setIsLoading(true);
        setError('');
        
        // 编码XML数据
        const encodedXml = encodeURIComponent(xmlData);
        
        // 构建draw.io viewer URL
        const viewerUrl = `https://viewer.diagrams.net/?lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Generated%20Diagram#${encodedXml}`;
        
        // 设置iframe src
        if (iframeRef.current) {
          iframeRef.current.src = viewerUrl;
        }
        
      } catch (err) {
        console.error('加载图表失败:', err);
        setError('加载图表失败: ' + err.message);
        setIsLoading(false);
      }
    };

    // 延迟加载，确保组件完全渲染
    const timer = setTimeout(loadDiagram, 100);
    return () => clearTimeout(timer);
  }, [xmlData, isVisible]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('无法加载draw.io查看器');
    setIsLoading(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="drawio-viewer">
      <div className="viewer-header">
        <h3>📊 图表预览</h3>
        <div className="viewer-controls">
          <span className="viewer-status">
            {isLoading ? '🔄 加载中...' : '✅ 预览就绪'}
          </span>
        </div>
      </div>
      
      <div className="viewer-container">
        {error ? (
          <div className="viewer-error">
            <p>❌ {error}</p>
            <p>请检查生成的XML格式是否正确</p>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="viewer-loading">
                <div className="loading-spinner"></div>
                <p>正在加载图表预览...</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              className={`viewer-iframe ${isLoading ? 'hidden' : ''}`}
              title="Draw.io图表预览"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </>
        )}
      </div>
      
      <div className="viewer-footer">
        <p>💡 提示: 可以在预览窗口中缩放、平移查看图表</p>
      </div>
    </div>
  );
};

export default DrawIOViewer; 