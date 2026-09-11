import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
import { 
  Share2, FileDown, Bookmark, Sparkles, Check, 
  Calendar, FileText, Send, XCircle, 
  Copy, RefreshCw, AlertTriangle, ShieldCheck, 
  ExternalLink, Layers, CheckCircle2, ChevronRight
} from 'lucide-react';
import ScheduleInterviewModal from '../../components/modals/ScheduleInterviewModal';
import ShareDossierModal from '../../components/modals/ShareDossierModal';
import '../../styles/pages.css';

const CandidateDetailsPage = () => {
  const { id } = useParams();
  const { showToast } = useAuth();
  const candidateName = 'Dishan Perera';

  const [activeTab, setActiveTab] = useState('eval');
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(true);

  const [isRegeneratingQuestions, setIsRegeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState([
    {
      domain: 'ARCHITECTURE & SCALABILITY',
      focus: 'Next.js LCP optimization',
      question: '“In your Virtusa role, you mentioned reducing LCP by 42%. Could you detail the specific trade-offs you navigated between server-side streaming and edge compute caching strategies?”',
      signal: 'Granular understanding of React Server Components, Suspense boundaries, and CDN header tuning.'
    },
    {
      domain: 'TEAM GOVERNANCE & CI/CD',
      focus: 'Module Federation across 9 devs',
      question: '“How did you resolve shared dependency version mismatches across micro-frontends without bloating vendor runtime bundles or breaking backwards compatibility?”',
      signal: 'Shared singleton static handling, semantic version lockstep contracts, and regression pipelines.'
    },
    {
      domain: 'FULLSTACK ELASTICITY',
      focus: 'Backend bridging & concurrency',
      question: '“Our core services utilize Go for low-latency RPC transactions. How do you approach designing API contracts to prevent frontend cascades when consuming asynchronous microservice topologies?”',
      signal: 'Protocol buffers awareness, GraphQL/BFF integration patterns, and resilient timeout fallbacks.'
    }
  ]);

  const handleRegenerateQuestions = () => {
    setIsRegeneratingQuestions(true);
    setTimeout(() => {
      setIsRegeneratingQuestions(false);
      showToast('AI synthesized 3 new targeted discrepancy interview probes!', 'success');
    }, 1000);
  };

  const handleCopyScratchpad = () => {
    const text = questions.map((q, i) => `${i + 1}. [${q.domain}] ${q.question}\nExpected Signal: ${q.signal}`).join('\n\n');
    navigator.clipboard.writeText(text);
    showToast('Interview questions copied to Scratchpad clipboard!', 'success');
  };

  const handleExportPdf = () => {
    showToast('Generating candidate evaluation dossier PDF (REQ-5.4)... Download ready!', 'success');
  };

  return (
    <div className="page-wrapper">
      {/* Top Header */}
      <div className="page-top-bar" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Link to={ROUTES.CANDIDATES} style={{ color: '#64748b', textDecoration: 'none' }}>Candidates</Link>
            <ChevronRight size={12} />
            <span>Senior Frontend Engineer (Req #FE-802)</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{candidateName}</span>
          </div>
          <h1 className="page-h1">Candidate Evaluation Dossier</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: 'auto', padding: '0 14px', height: 38, fontSize: '0.785rem' }}
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 size={14} />
            <span>Share Dossier</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ width: 'auto', padding: '0 14px', height: 38, fontSize: '0.785rem' }}
            onClick={handleExportPdf}
          >
            <FileDown size={14} />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{ width: 'auto', padding: '0 16px', height: 38, fontSize: '0.785rem' }}
            onClick={() => {
              setIsShortlisted(!isShortlisted);
              showToast(isShortlisted ? 'Candidate removed from Shortlist' : 'Candidate added to Shortlist', 'info');
            }}
          >
            <Bookmark size={14} fill={isShortlisted ? 'currentColor' : 'none'} />
            <span>{isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="dossier-tab-row">
        <button
          type="button"
          className={`dossier-tab-btn ${activeTab === 'eval' ? 'active' : ''}`}
          onClick={() => setActiveTab('eval')}
        >
          AI Evaluation (Active)
        </button>
        <button
          type="button"
          className={`dossier-tab-btn ${activeTab === 'work' ? 'active' : ''}`}
          onClick={() => setActiveTab('work')}
        >
          Work Experience (4 Roles)
        </button>
        <button
          type="button"
          className={`dossier-tab-btn ${activeTab === 'edu' ? 'active' : ''}`}
          onClick={() => setActiveTab('edu')}
        >
          Education & Certs
        </button>
        <button
          type="button"
          className={`dossier-tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          Raw CV Text
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="dossier-layout">
        {/* Left Candidate Profile Summary Card */}
        <div className="dossier-sidebar-card">
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 12px auto' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80"
                alt={candidateName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eef2ff' }}
              />
              <span className="verified-tick-badge" style={{ width: 18, height: 18, bottom: 2, right: 2 }}>
                <Check size={12} />
              </span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f5f3ff', color: '#7c3aed', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: 9999, marginBottom: 8 }}>
              <Sparkles size={12} /> Top 2% Applicant
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{candidateName}</h2>
            <p style={{ fontSize: '0.8125rem', color: '#4f46e5', fontWeight: 700 }}>Senior Frontend Architect</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>Ex-Virtusa Corp • 📍 Colombo (Remote)</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Experience</div>
              <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>6.2 <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Years</span></div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Notice Window</div>
              <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>2 <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Weeks</span></div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Expected Comp</div>
              <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>$48k <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/yr</span></div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Pipeline Phase</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="status-dot-green" /> Immediate
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} color="#4f46e5" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0f172a' }}>Dishan_Perera_Resume.pdf</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>1.6 MB • OCR Verified</div>
              </div>
            </div>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: 4 }}
              onClick={() => showToast('Opening original PDF resume...', 'info')}
            >
              <ExternalLink size={15} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            <button
              type="button"
              className="btn-primary"
              style={{ height: 42, fontSize: '0.8125rem' }}
              onClick={() => setInterviewModalOpen(true)}
            >
              <Calendar size={15} />
              <span>Schedule Technical Interview</span>
            </button>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, height: 38, fontSize: '0.75rem' }}
                onClick={() => showToast('Skill benchmark & Leetcode assessment dispatched to candidate email.', 'success')}
              >
                <Send size={13} />
                <span>Send Assessment</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, height: 38, fontSize: '0.75rem', color: '#ef4444', borderColor: '#fecaca', background: '#fef2f2' }}
                onClick={() => showToast('Candidate marked as declined. Polite rejection feedback generated.', 'info')}
              >
                <XCircle size={13} />
                <span>Decline</span>
              </button>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.725rem', fontWeight: 800, color: '#4f46e5', marginBottom: 6 }}>
              <Sparkles size={13} />
              <span>AI RECRUITER BRIEFING</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 10 }}>
              “Dishan stands out as an elite front-end architect with proven Next.js production performance and cross-functional team leadership. He demonstrates rare maturity in design system governance and micro-frontend isolation patterns, making him an exceptionally low-friction hire for enterprise UI initiatives.”
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
              <span>Synthesized 14 mins ago</span>
              <span>Confidence: <strong style={{ color: '#059669' }}>98.4%</strong></span>
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} color="#4f46e5" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>AI-Verified Core Strengths</h3>
            </div>
            <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Validated against JD #JD-9042</span>
          </div>

          {/* 3 Strengths Cards */}
          <div className="strengths-grid">
            <div className="strength-box">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Layers size={18} />
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Next.js Performance Tuning</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, marginBottom: 12 }}>
                Engineered server-driven streaming & dynamic import partitions resulting in a verified 42% LCP reduction at scale on high-traffic fintech portals.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>✓ Production Verified</span>
                <strong style={{ color: '#4f46e5' }}>100% Match</strong>
              </div>
            </div>

            <div className="strength-box">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Sparkles size={18} />
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Micro-frontends Leadership</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, marginBottom: 12 }}>
                Spearheaded Module Federation adoption across 9 front-end engineers. Reduced team merge collisions and enabled isolated CI/CD zero-downtime releases.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>✓ Cross-functional</span>
                <strong style={{ color: '#4f46e5' }}>96% Match</strong>
              </div>
            </div>

            <div className="strength-box">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <CheckCircle2 size={18} />
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Design Systems Architecture</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, marginBottom: 12 }}>
                Created enterprise Tailwind + Radix UI token libraries conforming rigorously to WCAG 2.1 AAA compliance standards with zero-audit regressions.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>✓ High Accuracy</span>
                <strong style={{ color: '#4f46e5' }}>85% Match</strong>
              </div>
            </div>
          </div>

          {/* Technical Competency */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Technical Competency & Alignment</h4>
                <p style={{ fontSize: '0.725rem', color: '#64748b' }}>Benchmark scores against 1,280 evaluated frontend engineering profiles</p>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Target Baseline: <strong>80%</strong></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', fontWeight: 700, marginBottom: 4 }}>
                  <span>React & Next.js Framework Ecosystem</span>
                  <span style={{ color: '#059669' }}>Exceeds Requirement • 98%</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: '98%', background: '#10b981' }} /></div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 3 }}>Evidence: 5+ years production SSR/SSG. Turbopack migration. App Router layout patterns.</div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', fontWeight: 700, marginBottom: 4 }}>
                  <span>TypeScript (Strict Mode, Generics & AST)</span>
                  <span style={{ color: '#4f46e5' }}>Strong Fit • 94%</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: '94%', background: '#4f46e5' }} /></div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 3 }}>Evidence: Strict compiler configs, generic utility type design, full schema-to-client codegen workflows.</div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', fontWeight: 700, marginBottom: 4 }}>
                  <span>State Management & Cache Layer (Redux / Zustand / TanStack)</span>
                  <span style={{ color: '#2563eb' }}>Target Matched • 90%</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: '90%', background: '#3b82f6' }} /></div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 3 }}>Evidence: Normalized state normalization, offline synchronization caches, TanStack query hooks.</div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', fontWeight: 700, marginBottom: 4 }}>
                  <span>Testing & QA Automation (Jest, React Testing Library, Playwright)</span>
                  <span style={{ color: '#64748b' }}>Meets Standard • 85%</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: '85%', background: '#64748b' }} /></div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 3 }}>Evidence: 88% coverage on shared UI packages, visual regression tests on Chromatic.</div>
              </div>
            </div>
          </div>

          {/* Potential Growth Areas */}
          <div style={{ background: '#f8fafc', border: '1px solid #dbeafe', borderRadius: 14, padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 800, color: '#1e40af', marginBottom: 8 }}>
              <AlertTriangle size={16} color="#2563eb" />
              <span>Potential Growth Areas & Cautionary Factors</span>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <strong style={{ fontSize: '0.785rem', color: '#0f172a' }}>Backend Golang Experience is Foundational</strong>
                <span style={{ fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>Risk Level: Low</span>
              </div>
              <p style={{ fontSize: '0.725rem', color: '#64748b', lineHeight: 1.45 }}>
                While the role prefers full stack elasticity into Go microservices, Dishan’s resume highlights primarily Node/Express and BFF APIs. Given his strong systemic architecture foundations, AI estimates an onboarding lag of approximately 3 weeks to achieve Go proficiency.
              </p>
            </div>
          </div>

          {/* Interview Questions */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={16} color="#4f46e5" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>AI Recruiter Tailored Interview Questions</h4>
                </div>
                <p style={{ fontSize: '0.725rem', color: '#64748b' }}>Targeted discrepancy probes synthesized from CV statements versus Role Requirements</p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="pill-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.725rem' }}
                  onClick={handleRegenerateQuestions}
                  disabled={isRegeneratingQuestions}
                >
                  <RefreshCw size={12} className={isRegeneratingQuestions ? 'spinner' : ''} />
                  <span>Regenerate</span>
                </button>
                <button
                  type="button"
                  className="pill-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.725rem' }}
                  onClick={handleCopyScratchpad}
                >
                  <Copy size={12} />
                  <span>Copy to Scratchpad</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {questions.map((q, idx) => (
                <div key={idx} className="interview-question-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', fontWeight: 800, color: '#4f46e5', marginBottom: 6 }}>
                    <span>{q.domain}</span>
                    <span style={{ color: '#64748b', fontWeight: 500 }}>Focus: {q.focus}</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.45, marginBottom: 8 }}>
                    {q.question}
                  </p>
                  <div style={{ fontSize: '0.725rem', color: '#64748b', background: '#f8fafc', padding: '6px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={13} color="#059669" />
                    <span><strong>Expected signal:</strong> {q.signal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScheduleInterviewModal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        candidateName={candidateName}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      <ShareDossierModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        candidateName={candidateName}
        onCopySuccess={(msg) => showToast(msg, 'success')}
      />
    </div>
  );
};

export default CandidateDetailsPage;
