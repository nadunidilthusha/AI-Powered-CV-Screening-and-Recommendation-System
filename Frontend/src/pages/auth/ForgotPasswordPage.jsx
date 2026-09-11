import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
import { Shield, Lock, Mail, Clock, ArrowLeft, Send, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../../styles/auth.css';

const ForgotPasswordPage = () => {
  const { forgotPassword, showToast } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered work email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid work email address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email);
      setSentSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-viewport-bg">
      <div className="forgot-card">
        {/* Top Badges Row */}
        <div className="status-badges-row" style={{ paddingBottom: 14, marginBottom: 18 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', color: '#166534', fontSize: '0.725rem', fontWeight: 700, padding: '4px 10px', borderRadius: 9999, border: '1px solid #bbf7d0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} />
            <span>ACTIVE TLS 1.3</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
            <Lock size={13} />
            <span>256-Bit Encrypted</span>
          </div>
        </div>

        {/* Shield Icon */}
        <div className="shield-icon-wrapper">
          <Shield size={28} />
        </div>

        <h1 className="auth-title" style={{ fontSize: '1.45rem', marginBottom: 4 }}>
          Reset Your Password
        </h1>
        <p style={{ fontSize: '0.785rem', fontWeight: 700, color: '#4f46e5', marginBottom: 10 }}>
          AI-Powered CV Screening and Recommendation System (TalentLens)
        </p>
        <p className="auth-subtitle" style={{ fontSize: '0.825rem', marginBottom: 16 }}>
          Enter your registered corporate email to receive a secure password recovery token.
        </p>

        {/* Strict Time-Bound Notice */}
        <div className="time-bound-notice">
          <Clock size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#1e3a8a', marginBottom: 2 }}>Strict Time-Bound Request</div>
            <div style={{ fontSize: '0.725rem', color: '#3b82f6', lineHeight: 1.4 }}>15-minute token expiry window for enterprise data security.</div>
          </div>
        </div>

        {sentSuccess ? (
          <div className="compliance-notice-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', marginBottom: 20 }}>
            <CheckCircle2 size={20} color="#10b981" />
            <div>
              <strong>Recovery link dispatched!</strong> Please check <strong>{email}</strong> for instructions. The token will expire in 15 minutes.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">
                Work Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="forgot-email"
                  type="email"
                  className={`form-input ${error ? 'has-error' : ''}`}
                  placeholder="colleague@enterprise.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={loading}
                />
              </div>
              {error && (
                <span className="error-text">
                  <AlertCircle size={12} /> {error}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span>Transmitting Recovery Token...</span>
                ) : (
                  <>
                    <span>Send Recovery Link</span>
                    <Send size={15} />
                  </>
                )}
              </button>

              <Link to={ROUTES.LOGIN} className="btn-secondary" style={{ textDecoration: 'none' }}>
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}

        {sentSuccess && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <Link to={ROUTES.LOGIN} className="btn-primary" style={{ textDecoration: 'none' }}>
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        )}

        <div className="helpdesk-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HelpCircle size={16} color="#64748b" />
            <span>Having trouble accessing your workspace?</span>
          </div>
          <button
            type="button"
            style={{ fontWeight: 700, color: '#4338ca', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
            onClick={() => showToast('IT Security Helpdesk ticket generated. Ref: #SEC-98402', 'info')}
          >
            Contact IT Helpdesk
          </button>
        </div>
      </div>

      <footer style={{ marginTop: 24, textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
        <p>© 2025 AI-Powered CV Screening and Recommendation System. Enterprise Privacy Protected.</p>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
