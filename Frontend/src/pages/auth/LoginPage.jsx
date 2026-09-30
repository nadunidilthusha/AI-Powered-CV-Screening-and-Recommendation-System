import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Cpu, AlertCircle } from 'lucide-react';
import '../../styles/auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, showToast } = useAuth();

  const [email, setEmail] = useState('recruiter@company.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberWorkstation, setRememberWorkstation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Corporate work email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid work email address.';
    }

    if (!password) {
      errs.password = 'Workspace password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password, rememberWorkstation);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setErrors({ form: err.message });
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-viewport-bg">
      <div className="login-card">
        {/* Header Branding */}
        <div className="auth-header">
          <div className="engine-logo">
            <Cpu size={32} strokeWidth={2.2} />
          </div>

          <div className="engine-tag">
            <span>✦ TALENTLENS ENGINE V4.2</span>
          </div>

          <h1 className="auth-title">AI-Powered CV Screening</h1>
          <p className="auth-subtitle">
            Autonomous Multi-Agent Talent Intelligence. Sign in to access your recruitment workspace.
          </p>
        </div>

        {/* Status Badges */}
        <div className="status-badges-row">
          <div className="status-badge-online">
            <span className="status-dot-green" />
            <span>SYSTEM ONLINE</span>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
            SOC-2 Type II Certified
          </div>
        </div>

        {errors.form && (
          <div className="error-text" style={{ marginBottom: 16, justifyContent: 'center' }}>
            <AlertCircle size={15} />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Corporate Work Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={18} />
              </span>
              <input
                id="login-email"
                type="email"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                placeholder="recruiter@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                }}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <span className="error-text">
                <AlertCircle size={13} /> {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Workspace Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'has-error' : ''}`}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                }}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">
                <AlertCircle size={13} /> {errors.password}
              </span>
            )}
          </div>

          <div className="form-options-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberWorkstation}
                onChange={(e) => setRememberWorkstation(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#475569' }}>Remember workstation</span>
            </label>

            <Link to={ROUTES.FORGOT_PASSWORD} className="link-button" style={{ fontSize: '0.875rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating Workspace...</span>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="compliance-notice-box">
          <ShieldCheck size={20} style={{ color: '#059669', flexShrink: 0 }} />
          <div>
            Protected by <strong>SOC-2 Type II</strong> & <strong>Zero Bias AI Compliance</strong> standards. All model weights cryptographically anchored.
          </div>
        </div>

        <div style={{ marginTop: 24, fontSize: '0.8125rem', color: '#64748b' }}>
          <span>Don't have a recruiter account? </span>
          <Link to={ROUTES.REGISTER} style={{ color: '#4338ca', fontWeight: 700 }}>
            Sign Up
          </Link>
        </div>
      </div>

      <footer style={{ marginTop: 24, textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
        <p style={{ marginBottom: 6 }}>🔒 256-bit TLS Encrypted • 📍 Multi-Agent Pipeline</p>
        <p>© 2025 AI-Powered CV Screening and Recommendation System. Enterprise Privacy Protected.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
