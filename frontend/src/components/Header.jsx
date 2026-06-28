import React from 'react';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="app-header glass-panel animate-fade-in">
      <div className="logo-section">
        <div className="logo-icon">TT</div>
        <div className="app-title gradient-text-glow">Task Tracker</div>
      </div>
      <div className="theme-btn-container">
        <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }} className="gradient-text">
          Task Management Portal
        </span>
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;
