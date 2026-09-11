import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const LogoutModal = ({ isOpen, onClose, onConfirm, userEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog animate-fade-in" style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
          <ShieldAlert size={26} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Terminate Active Session?</h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: 24 }}>
          Signing out will invalidate your current JWT access token for <strong>{userEmail || 'this session'}</strong>. Any unsaved candidate pipeline reviews will be securely locked.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
          >
            Stay Signed In
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
          >
            Confirm Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default LogoutModal;
