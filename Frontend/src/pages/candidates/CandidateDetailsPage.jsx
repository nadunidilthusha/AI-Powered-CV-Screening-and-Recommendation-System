import React, { useState, useEffect } from 'react';
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
import candidateService from '../../services/candidateService';
import '../../styles/pages.css';

// Defensive normaliser for legacy data whose skill fields may be strings.
const toSkillArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(/\s*,\s*|\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const CandidateDetailsPage = () => {
  const { id } = useParams();
  const { showToast } = useAuth();
  
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await candidateService.getCandidateById(id);
        const c = res.data.data;
        const formatted = {
          id: c._id,
          name: c.name || c.fullName || 'Unknown',
          title: 'Candidate',
          matchPct: c.aiEvaluation?.matchPercentage || 0,
          avatar: c.cvUrl || 'https://via.placeholder.com/150',
          skills: toSkillArray(c.technicalSkills),
          matchingSkills: toSkillArray(c.aiEvaluation?.matchingSkills),
          missingSkills: toSkillArray(c.aiEvaluation?.missingSkills),
          justification: c.aiEvaluation?.justification || '',
          recommendationStatus: c.aiEvaluation?.recommendationStatus || 'Pending',
          expEdu: `${c.experience || '0 Yrs'} • ${c.education || 'N/A'}`,
          status: c.status || 'Under Review',
          job: 'All Roles',
          availability: 'Immediate',
          email: c.email,
          phone: c.phone
        };
        setCandidate(formatted);
      } catch (err) {
        console.error('Failed to fetch candidate details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const candidateName = candidate?.name || '';

  const [activeTab, setActiveTab] = useState('eval');
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(true);

  const [isRegeneratingQuestions, setIsRegeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState([
    {
      domain: 'ARCHITECTURE & SCALABILITY',
      focus: 'Next.js LCP optimization',
      question: '"In your Virtusa role, you mentioned reducing LCP by 42%. Could you detail the specific trade-offs you navigated between server-side streaming and edge compute caching strategies?"',
      signal: 'Granular understanding of React Server Components, Suspense boundaries, and CDN header tuning.'
    },
    {
      domain: 'TEAM GOVERNANCE & CI/CD',
      focus: 'Module Federation across 9 devs',
      question: '"How did you resolve shared dependency version mismatches across micro-frontends without bloating vendor runtime bundles or breaking backwards compatibility?"',
      signal: 'Shared singleton static handling, semantic version lockstep contracts, and regression pipelines.'
    },
    {
      domain: 'FULLSTACK ELASTICITY',
      focus: 'Backend bridging & concurrency',
      question: '"Our core services utilize Go for low-latency RPC transactions. How do you approach designing API contracts to prevent frontend cascades when consuming asynchronous microservice topologies?"',
      signal: 'Protocol buffers awareness, GraphQL/BFF integration patterns, and resilient timeout fallbacks.'
    }
  ]);

  if (loading || !candidate) {
    return <div className="p-8 text-center text-slate-500">Loading candidate details...</div>;
  }

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
    const blob = new Blob(['Mock PDF content for ' + candidateName], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidateName.replace(/\s+/g, '_')}_Profile.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Candidate evaluation dossier PDF downloaded!', 'success');
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidate Evaluation Dossier</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 flex items-center justify-center"
            style={{ width: 'auto', padding: '0 14px', height: 38, fontSize: '0.785rem' }}
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 size={14} />
            <span>Share Dossier</span>
          </button>

          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 flex items-center justify-center"
            style={{ width: 'auto', padding: '0 14px', height: 38, fontSize: '0.785rem' }}
            onClick={handleExportPdf}
          >
            <FileDown size={14} />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 flex items-center justify-center gap-2"
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
          Work Experience
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
                src={candidate.avatar}
                alt={candidateName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eef2ff' }}
              />
              <span className="verified-tick-badge" style={{ width: 18, height: 18, bottom: 2, right: 2 }}>
                <Check size={12} />
              </span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f5f3ff', color: '#7c3aed', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: 9999, marginBottom: 8 }}>
              <Sparkles size={12} /> Top {Math.max(1, Math.round(100 - candidate.matchPct))}% Applicant
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{candidateName}</h2>
            <p style={{ fontSize: '0.8125rem', color: '#4f46e5', fontWeight: 700 }}>{candidate.title}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{candidate.job} • 📍 Remote</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Experience</div>
              <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>{candidate.expEdu.split('•')[0].trim().replace('Yrs', '')} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Years</span></div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Notice Window</div>
              <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>{candidate.availability}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Match Pct</div>
              <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>{candidate.matchPct}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Pipeline Phase</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="status-dot-green" /> {candidate.status}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} color="#4f46e5" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0f172a' }}>{candidateName.replace(/\s+/g, '_')}_Resume.pdf</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>OCR Verified</div>
              </div>
            </div>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: 4 }}
              onClick={() => window.open('/sample-resume.pdf', '_blank')}
            >
              <ExternalLink size={15} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 flex items-center justify-center gap-2"
              style={{ height: 42, fontSize: '0.8125rem' }}
              onClick={() => setInterviewModalOpen(true)}
            >
              <Calendar size={15} />
              <span>Schedule Technical Interview</span>
            </button>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 flex items-center justify-center"
                style={{ flex: 1, height: 38, fontSize: '0.75rem' }}
                onClick={() => showToast('Skill benchmark & Leetcode assessment dispatched to candidate email.', 'success')}
              >
                <Send size={13} />
                <span>Send Assessment</span>
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 flex items-center justify-center"
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
              {candidate.justification || 'AI evaluation in progress.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
              <span>Recommendation: <strong>{candidate.recommendationStatus}</strong></span>
              <span>Match: <strong style={{ color: '#059669' }}>{candidate.matchPct}%</strong></span>
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
            <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Match Score: {candidate.matchPct}%</span>
          </div>

          {/* Skills matching panel — uses normalised arrays */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 20, marginBottom: 24 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Technical Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {candidate.skills.length > 0 ? candidate.skills.map((s, i) => (
                <span key={i} className="token-pill" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>{s}</span>
              )) : <span style={{ color: '#64748b', fontSize: '0.8rem' }}>No skills extracted.</span>}
            </div>

            {candidate.matchingSkills.length > 0 && (
              <>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', marginBottom: 8 }}>Matching Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {candidate.matchingSkills.map((s, i) => (
                    <span key={i} style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 6 }}>{s}</span>
                  ))}
                </div>
              </>
            )}

            {candidate.missingSkills.length > 0 && (
              <>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Missing Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {candidate.missingSkills.map((s, i) => (
                    <span key={i} style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 6 }}>{s}</span>
                  ))}
                </div>
              </>
            )}
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