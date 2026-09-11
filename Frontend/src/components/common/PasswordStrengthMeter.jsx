import React from 'react';

export const PasswordStrengthMeter = ({ password }) => {
  const evaluateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'No Password', level: '' };

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) {
      return { score: 1, label: 'Weak', level: 'weak' };
    } else if (score <= 4) {
      return { score: 2, label: 'Moderate Security', level: 'medium' };
    } else {
      return { score: 3, label: 'Strong Password (AES Isolated)', level: 'strong' };
    }
  };

  const { score, label, level } = evaluateStrength(password);

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.75rem' }}>
        <span style={{ fontWeight: 600, color: '#475569' }}>Security Metric</span>
        <span style={{
          fontWeight: 700,
          fontSize: '0.725rem',
          color: level === 'weak' ? '#ef4444' : level === 'medium' ? '#f59e0b' : '#4338ca'
        }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, height: 4, width: '100%' }}>
        <div style={{
          flex: 1, height: '100%', borderRadius: 2,
          backgroundColor: score >= 1 ? (level === 'weak' ? '#ef4444' : level === 'medium' ? '#f59e0b' : '#4738df') : '#e2e8f0',
          transition: 'background-color 0.2s'
        }} />
        <div style={{
          flex: 1, height: '100%', borderRadius: 2,
          backgroundColor: score >= 2 ? (level === 'medium' ? '#f59e0b' : '#4738df') : '#e2e8f0',
          transition: 'background-color 0.2s'
        }} />
        <div style={{
          flex: 1, height: '100%', borderRadius: 2,
          backgroundColor: score >= 3 ? '#4738df' : '#e2e8f0',
          transition: 'background-color 0.2s'
        }} />
      </div>
    </div>
  );
};
export default PasswordStrengthMeter;
