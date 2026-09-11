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

  const handleGoogleSso = () => {
    showToast('Authenticating via Google Workspace SSO...', 'info');
    setTimeout(async () => {
      await login('recruiter@company.com', 'Password123!', true);
      navigate(ROUTES.DASHBOARD);
    }, 800);
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

          <div className="form-options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberWorkstation}
                onChange={(e) => setRememberWorkstation(e.target.checked)}
              />
              <span>Remember workstation</span>
            </label>

            <Link to={ROUTES.FORGOT_PASSWORD} className="link-button">
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

        <div className="sso-divider">
          <span>OR ENTERPRISE SINGLE SIGN-ON</span>
        </div>

        <button
          type="button"
          className="btn-google-sso"
          onClick={handleGoogleSso}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google Workspace</span>
        </button>

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
