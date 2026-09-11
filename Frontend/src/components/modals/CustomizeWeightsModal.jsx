import React, { useState } from 'react';
import { Sliders, X, RefreshCw } from 'lucide-react';

export const CustomizeWeightsModal = ({ isOpen, onClose, weights, onSaveWeights }) => {
  const [exp, setExp] = useState(weights?.experience || 40);
  const [skills, setSkills] = useState(weights?.skills || 40);
  const [culture, setCulture] = useState(weights?.culture || 20);

  if (!isOpen) return null;

  const total = exp + skills + culture;

  const handleSave = () => {
    onSaveWeights({ experience: exp, skills, culture });
    onClose();
  };

  const handleReset = () => {
    setExp(40);
    setSkills(40);
    setCulture(20);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: 480, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Vector Weighting Distribution</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Customize neural ontology factors for this role</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5' }} />
                Experience & Track Record
              </span>
              <strong style={{ color: '#4f46e5' }}>{exp}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={exp}
              onChange={e => setExp(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#4f46e5' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                Skills & Technical Mastery
              </span>
              <strong style={{ color: '#3b82f6' }}>{skills}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={skills}
              onChange={e => setSkills(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                Culture, Leadership & Fit
              </span>
              <strong style={{ color: '#10b981' }}>{culture}%</strong>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={culture}
              onChange={e => setCulture(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: total === 100 ? '#f0fdf4' : '#fffbeb', border: `1px solid ${total === 100 ? '#bbf7d0' : '#fde68a'}`, borderRadius: 8, padding: '10px 14px', fontSize: '0.75rem', color: total === 100 ? '#166534' : '#92400e' }}>
            <span>Total Weight: <strong>{total}%</strong></span>
            <button type="button" onClick={handleReset} style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <RefreshCw size={12} /> Reset Defaults
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" style={{ height: 44 }} onClick={handleSave}>
            Apply Vector Weights
          </button>
        </div>
      </div>
    </div>
  );
};
export default CustomizeWeightsModal;
