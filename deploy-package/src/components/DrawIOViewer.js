import React, { useState } from 'react';
import './DrawIOViewer.css';

function DrawIOViewer() {
  const [xmlContent, setXmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateDiagram = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/generate-xml');
      if (!response.ok) {
        throw new Error('生成失败');
      }
      const data = await response.text();
      setXmlContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="viewer-container">
      <button 
        onClick={generateDiagram}
        disabled={loading}
        className="generate-button"
      >
        {loading ? '生成中...' : '生成机理图'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      {xmlContent && (
        <div className="diagram-container">
          <div className="diagram-viewer">
            {/* 这里将来可以添加图表预览 */}
            <pre>{xmlContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrawIOViewer; 