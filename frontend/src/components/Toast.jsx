import React from 'react';
import './Toast.css';

const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const Toast = ({ toasts }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-item toast-${toast.type || 'success'}`}>
          <span className="toast-icon">{icons[toast.type] || icons.success}</span>
          <span className="toast-message">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
