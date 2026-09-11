import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
import { Sparkles, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import PasswordStrengthMeter from '../../components/common/PasswordStrengthMeter';
import '../../styles/auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, showToast } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: 'Engineering',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const specializations = [
    'Engineering',
    'Product Management',
    'Product Design & UX',
    'Sales / GTM'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!formData.jobTitle.trim()) errs.jobTitle = 'Corporate job title is required.';
    if (!formData.email.trim()) {
      errs.email = 'Corporate work email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid work email.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the Enterprise Data & Privacy Terms.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message }));
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-viewport-bg">
      <div className="register-wrapper">
        {/* Left Showcase Side */}
        <div className="register-showcase-panel">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} color="#a5b4fc" />
                </div>
                <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>TalentLens</span>
              </div>
              <span style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.6875rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, color: '#e0e7ff' }}>
                ENTERPRISE V3.2
              </span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#c7d2fe', fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 9999, marginBottom: 18 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              <span>14-Day Enterprise Trial Included</span>
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.25, marginBottom: 12 }}>
              Autonomous<br />Recruitment<br />Intelligence.
            </h2>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#c7d2fe', marginBottom: 28 }}>
              Deploy autonomous resume screening & candidate matching in minutes. Cut evaluation cycles by 84% without algorithmic bias.
            </p>

            {/* Neural Metric Card */}
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', fontWeight: 700, color: '#34d399' }}>
                  <Sparkles size={13} /> NEURAL PIPELINE
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#38bdf8' }}>98.4% Match Accuracy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 38, marginBottom: 10 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', height: '35%', borderRadius: 4 }} />
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', height: '50%', borderRadius: 4 }} />
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', height: '40%', borderRadius: 4 }} />
                <div style={{ flex: 1, background: 'rgba(129,140,248,0.6)', height: '75%', borderRadius: 4 }} />
                <div style={{ flex: 1, background: '#34d399', height: '100%', borderRadius: 4, boxShadow: '0 0 10px rgba(52,211,153,0.4)' }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: '#e0e7ff', textAlign: 'right', fontWeight: 600 }}>
                <strong style={{ fontSize: '1.15rem', color: '#ffffff', marginRight: 4 }}>250</strong> AI Parsings Credit
              </div>
            </div>

            {/* Testimonial */}
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80"
                  alt="Elena Vance"
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #818cf8', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Elena Vance</div>
                  <div style={{ fontSize: '0.6875rem', color: '#a5b4fc' }}>VP of Talent, HyperScale Labs</div>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', fontStyle: 'italic', lineHeight: 1.4, color: '#e0e7ff' }}>
                “TalentLens surfaced 12 top-tier senior distributed engineers from 1,400 CVs in under twenty minutes.”
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.725rem', fontWeight: 700, color: '#a5b4fc' }}>
            <span>🛡️ SOC-2 TYPE II</span>
            <span>•</span>
            <span>🔒 AES-256 ISOLATED</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="register-form-panel">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Create Recruiter Account</h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: 22 }}>
            Set up your workspace to activate automated CV synthesis and team matching.
          </p>

          {errors.form && (
            <div className="error-text" style={{ marginBottom: 14 }}>
              <AlertCircle size={15} />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="two-col-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="register-name">Full Name</label>
                <input
                  id="register-name"
                  type="text"
                  className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                  placeholder="Sarah Jenkins"
                  style={{ paddingLeft: 14 }}
                  value={formData.fullName}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  disabled={loading}
                />
                {errors.fullName && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.fullName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-title">Job Title</label>
                <input
                  id="register-title"
                  type="text"
                  className={`form-input ${errors.jobTitle ? 'has-error' : ''}`}
                  placeholder="Lead Technical Recruiter"
                  style={{ paddingLeft: 14 }}
                  value={formData.jobTitle}
                  onChange={e => handleInputChange('jobTitle', e.target.value)}
                  disabled={loading}
                />
                {errors.jobTitle && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.jobTitle}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Work Email</label>
              <input
                id="register-email"
                type="email"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                placeholder="sarah@enterprise.io"
                style={{ paddingLeft: 14 }}
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                disabled={loading}
              />
              {errors.email && (
                <span className="error-text">
                  <AlertCircle size={12} /> {errors.email}
                </span>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Primary Screening Specialization</label>
              <div className="pills-group">
                {specializations.map(spec => (
                  <button
                    key={spec}
                    type="button"
                    className={`pill-btn ${formData.specialization === spec ? 'active' : ''}`}
                    onClick={() => handleInputChange('specialization', spec)}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="two-col-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="register-pwd">Password</label>
                <div className="input-wrapper">
                  <input
                    id="register-pwd"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'has-error' : ''}`}
                    placeholder="••••••••••••"
                    style={{ paddingLeft: 14 }}
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.password}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-confirm-pwd">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    id="register-confirm-pwd"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
                    placeholder="••••••••••••"
                    style={{ paddingLeft: 14 }}
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">
                    <AlertCircle size={12} /> {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <PasswordStrengthMeter password={formData.password} />

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={e => handleInputChange('agreeTerms', e.target.checked)}
                />
                <span>
                  I agree to the <strong style={{ color: '#4338ca' }}>Candidate Privacy Charter</strong>, GDPR Data Controller Clauses, and <strong style={{ color: '#4338ca' }}>AI Model Processing Terms</strong>.
                </span>
              </label>
              {errors.agreeTerms && (
                <span className="error-text">
                  <AlertCircle size={12} /> {errors.agreeTerms}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span>Provisioning Workspace...</span>
              ) : (
                <>
                  <span>Create Workspace Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
            <span>Already have an active tenant? </span>
            <Link to={ROUTES.LOGIN} style={{ color: '#4338ca', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: 24, textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
        <p>© 2025 AI-Powered CV Screening and Recommendation System. Enterprise Privacy Protected.</p>
      </footer>
    </div>
  );
};

export default RegisterPage;
