import React from 'react';

const Toast = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card ${toast.type} animate-fade-in`}>
          <span className="toast-icon-badge">
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✗'}
            {toast.type === 'info' && 'ℹ'}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => onRemove(toast.id)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
