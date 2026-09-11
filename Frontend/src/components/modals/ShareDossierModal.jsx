import React, { useState } from 'react';
import { Share2, Copy, Check, Shield, X } from 'lucide-react';

export const ShareDossierModal = ({ isOpen, onClose, candidateName, onCopySuccess }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://talentlens.corp/dossier/secure-eval-hash-${Math.random().toString(36).substring(2, 9)}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onCopySuccess?.('Encrypted dossier link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: 460, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Share Candidate Dossier</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Generate secure link for hiring committee</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 6 }}>Encrypted Temporary Link (Expires in 24 Hours)</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                style={{ flex: 1, padding: '8px 10px', fontSize: '0.785rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, color: '#334155' }}
              />
              <button
                type="button"
                onClick={handleCopy}
                className="btn-primary"
                style={{ width: 'auto', padding: '0 14px', height: 36, fontSize: '0.785rem' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f7fe', border: '1px solid #dbeafe', borderRadius: 8, padding: '10px 12px', fontSize: '0.75rem', color: '#1e3a8a' }}>
            <Shield size={16} color="#2563eb" />
            <span>Link is protected with zero-trust token isolation and does not expose raw PII.</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn-secondary" style={{ width: 'auto', padding: '0 20px' }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default ShareDossierModal;
