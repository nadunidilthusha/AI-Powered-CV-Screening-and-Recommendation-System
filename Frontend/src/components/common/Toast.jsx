import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || !toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
          {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
          {toast.type === 'info' && <Info size={18} color="#4f46e5" />}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
export default ToastContainer;
