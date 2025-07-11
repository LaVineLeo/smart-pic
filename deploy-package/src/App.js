import React from 'react';
import './App.css';
import DrawIOViewer from './components/DrawIOViewer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.png" className="App-logo" alt="logo" />
        <h1>Smart-Pic - AI驱动的智能机理图生成器</h1>
      </header>
      <main>
        <DrawIOViewer />
      </main>
    </div>
  );
}

export default App; 