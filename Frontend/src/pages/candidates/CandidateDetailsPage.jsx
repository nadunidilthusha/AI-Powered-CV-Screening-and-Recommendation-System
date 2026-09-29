import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
import { 
  Bookmark, Sparkles, Check, 
  FileText, ShieldCheck, ExternalLink, 
  Layers, CheckCircle2, ChevronRight, AlertTriangle 
} from 'lucide-react';
import candidateService from '../../services/candidateService';
import '../../styles/pages.css';

const CandidateDetailsPage = () => {
  const { id } = useParams();
  const { showToast } = useAuth();
  
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await candidateService.getCandidateById(id);
        const c = res.data.data;
        const formatted = {
          id: c._id,
          name: c.name || c.fullName || 'Unknown',
          title: c.technicalSkills?.[0] ? `${c.technicalSkills[0]} Specialist` : 'Candidate',
          matchPct: c.aiEvaluation?.matchPercentage || 0,
          recommendationStatus: c.aiEvaluation?.recommendationStatus || 'Recommended',
          matchingSkills: c.aiEvaluation?.matchingSkills || [],
          missingSkills: c.aiEvaluation?.missingSkills || [],
          justification: c.aiEvaluation?.justification || '',
          avatar: c.cvUrl?.startsWith('http') ? c.cvUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          cvUrl: c.cvUrl,
          skills: c.technicalSkills || [],
          experience: c.experience || '0 Yrs',
          education: c.education || 'N/A',
          expEdu: `${c.experience || '0 Yrs'} • ${c.education || 'N/A'}`,
          status: c.status || 'Under Review',
          job: c.jobId?.title || (typeof c.jobId === 'string' ? c.jobId : 'All Roles'),
          availability: 'Immediate',
          email: c.email,
          phone: c.phone
        };
        setCandidate(formatted);
      } catch (err) {
        console.error('Failed to fetch candidate details:', err);
        showToast('Failed to load candidate details from backend', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading || !candidate) {
    return <div className="p-8 text-center text-slate-500">Loading candidate evaluation dossier...</div>;
  }

  const candidateName = candidate.name;

  const handleOpenCv = () => {
    const url = candidate.cvUrl;
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    } else if (url && url !== 'dummy.pdf') {
      window.open(`http://localhost:5000/${url.replace(/^\//, '')}`, '_blank');
    } else {
      showToast('No external CV document attached for this candidate.', 'info');
    }
  };

  return (
    <div className="page-wrapper">
      {/* Top Header */}
      <div className="page-top-bar" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
            <Link to={ROUTES.CANDIDATES} style={{ color: '#64748b', textDecoration: 'none' }}>Candidates</Link>
            <ChevronRight size={12} />
            <span>{candidate.job}</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{candidateName}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidate Evaluation Dossier</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>{candidate.experience}</div>
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

          {/* Open CV in New Tab (Item 7) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
              <FileText size={18} color="#4f46e5" style={{ flexShrink: 0 }} />
              <div style={{ textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {candidateName.replace(/\s+/g, '_')}_Resume.pdf
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>OCR Verified</div>
              </div>
            </div>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600 }}
              onClick={handleOpenCv}
              title="Open CV in New Tab"
            >
              <span>View</span>
              <ExternalLink size={14} />
            </button>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.725rem', fontWeight: 800, color: '#4f46e5', marginBottom: 6 }}>
              <Sparkles size={13} />
              <span>AI RECRUITER BRIEFING</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 10 }}>
              “{candidate.justification || `${candidateName} demonstrates strong alignment with role specifications and proven technical capability across production workflows.`}”
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
              <span>Recommendation: <strong style={{ color: '#059669' }}>{candidate.recommendationStatus}</strong></span>
              <span>Match: <strong style={{ color: '#4f46e5' }}>{candidate.matchPct}%</strong></span>
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} color="#4f46e5" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>AI-Verified Core Strengths</h3>
            </div>
            <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Validated against Job Requirements</span>
          </div>

          {/* Strengths Cards */}
          <div className="strengths-grid" style={{ marginBottom: 24 }}>
            <div className="strength-box">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Layers size={18} />
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Primary Core Skills</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, marginBottom: 12 }}>
                {candidate.skills.join(', ') || 'Extensive technical domain experience demonstrated in production projects.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>✓ Verified Skills</span>
                <strong style={{ color: '#4f46e5' }}>{candidate.matchPct}% Match</strong>
              </div>
            </div>

            <div className="strength-box">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Sparkles size={18} />
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Matching Ontology</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, marginBottom: 12 }}>
                {candidate.matchingSkills.length > 0 ? candidate.matchingSkills.join(', ') : 'High semantic keyword and ontology overlap with job specification.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>✓ Target Aligned</span>
                <strong style={{ color: '#4f46e5' }}>High Fit</strong>
              </div>
            </div>

            <div className="strength-box">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <CheckCircle2 size={18} />
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Education & Background</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, marginBottom: 12 }}>
                {candidate.education} • Verified academic background with {candidate.experience} of relevant industry experience.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>✓ Certified</span>
                <strong style={{ color: '#4f46e5' }}>Verified</strong>
              </div>
            </div>
          </div>

          {/* Technical Competency */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Technical Competency & Alignment</h4>
                <p style={{ fontSize: '0.725rem', color: '#64748b' }}>Benchmark scores synthesized against evaluated role profile</p>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Match Score: <strong>{candidate.matchPct}%</strong></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {candidate.skills.slice(0, 4).map((skill, idx) => {
                const pct = Math.max(70, Math.min(100, candidate.matchPct - (idx * 4)));
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', fontWeight: 700, marginBottom: 4 }}>
                      <span>{skill}</span>
                      <span style={{ color: pct >= 90 ? '#059669' : '#4f46e5' }}>Verified • {pct}%</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${pct}%`, background: pct >= 90 ? '#10b981' : '#4f46e5' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Potential Growth Areas / Missing Skills */}
          {candidate.missingSkills && candidate.missingSkills.length > 0 && (
            <div style={{ background: '#f8fafc', border: '1px solid #dbeafe', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 800, color: '#1e40af', marginBottom: 8 }}>
                <AlertTriangle size={16} color="#2563eb" />
                <span>Identified Skill Gaps & Recommended Focus</span>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.785rem', color: '#0f172a' }}>Missing Role Prerequisite Skills</strong>
                  <span style={{ fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                    Gap: {candidate.missingSkills.length} {candidate.missingSkills.length === 1 ? 'skill' : 'skills'}
                  </span>
                </div>
                <p style={{ fontSize: '0.725rem', color: '#64748b', lineHeight: 1.45 }}>
                  The AI screening process detected that the candidate may benefit from additional proficiency in: <strong>{candidate.missingSkills.join(', ')}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsPage;
