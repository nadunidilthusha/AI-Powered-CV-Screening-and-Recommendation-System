import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
import { 
  Search, UploadCloud, Download, Filter, 
  ChevronDown, Sparkles, Sliders, CheckCircle2, Calendar, 
  UserCheck, Scale, RefreshCw, Send, ShieldCheck, FileText, 
  Award, Check, ExternalLink, Layers 
} from 'lucide-react';
import ScheduleInterviewModal from '../../components/modals/ScheduleInterviewModal';
import CustomizeWeightsModal from '../../components/modals/CustomizeWeightsModal';
import { mockCandidates } from '../../data/mockCandidates';
import '../../styles/pages.css';

const CandidateListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  // Active Tab: 'pipeline' | 'recommendations'
  const [activeTab, setActiveTab] = useState('pipeline');

  // Shared Modals
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState('Dishan Perera');
  const [weightsModalOpen, setWeightsModalOpen] = useState(false);

  // ==========================================
  // PIPELINE STATE (Screenshot 2)
  // ==========================================
  const [selectedRows, setSelectedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [poolSearchQuery, setPoolSearchQuery] = useState('');
  const [selectedExpBracket, setSelectedExpBracket] = useState(null);
  const [skillsFilter, setSkillsFilter] = useState({
    reactNext: false,
    typescript: false,
    python: false,
    aws: false
  });
  const [availability, setAvailability] = useState(null);
  const [selectedJobRequisition, setSelectedJobRequisition] = useState('All Roles');
  const [sortOption, setSortOption] = useState('Highest AI Match');
  const [currentPage, setCurrentPage] = useState(1);



  const filteredCandidates = mockCandidates.filter(c => {
    // TC_CL_001
    if (selectedJobRequisition && selectedJobRequisition !== 'All Roles' && c.job !== selectedJobRequisition) return false;

    // TC_CL_004
    if (poolSearchQuery && !c.name.toLowerCase().includes(poolSearchQuery.toLowerCase()) && !c.title.toLowerCase().includes(poolSearchQuery.toLowerCase())) return false;

    // TC_CL_005
    if (searchQuery) {
       const term = searchQuery.toLowerCase();
       const hasMatch = c.name.toLowerCase().includes(term) || c.title.toLowerCase().includes(term) || c.skills.some(s => s.toLowerCase().includes(term));
       if (!hasMatch) return false;
    }

    // TC_CL_006
    if (selectedExpBracket) {
      const expMatch = c.expEdu.match(/([\d.]+)\s*Yrs/i);
      const expYears = expMatch ? parseFloat(expMatch[1]) : 0;
      if (selectedExpBracket === '0-2 Yrs' && expYears > 2) return false;
      if (selectedExpBracket === '3-5 Yrs' && (expYears <= 2 || expYears > 5)) return false;
      if (selectedExpBracket === '6+ Yrs' && expYears <= 5) return false;
    }

    // TC_CL_007
    if (Object.values(skillsFilter).some(Boolean)) {
      const hasReact = skillsFilter.reactNext && c.skills.some(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('next'));
      const hasTs = skillsFilter.typescript && c.skills.some(s => s.toLowerCase().includes('typescript'));
      const hasPython = skillsFilter.python && c.skills.some(s => s.toLowerCase().includes('python') || s.toLowerCase().includes('fastapi'));
      const hasAws = skillsFilter.aws && c.skills.some(s => s.toLowerCase().includes('aws') || s.toLowerCase().includes('cloud'));
      
      const activeFiltersCount = Object.values(skillsFilter).filter(Boolean).length;
      const matchedFiltersCount = [hasReact, hasTs, hasPython, hasAws].filter(Boolean).length;
      if (activeFiltersCount > 0 && matchedFiltersCount === 0) return false;
    }

    // TC_CL_008
    if (availability && c.availability !== availability && availability !== 'Any') return false;

    return true;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortOption === 'Highest AI Match') return b.matchPct - a.matchPct;
    if (sortOption === 'Name A-Z') return a.name.localeCompare(b.name);
    if (sortOption === 'Experience (High to Low)') {
      const getExp = (str) => {
        const m = str.match(/([\d.]+)\s*Yrs/i);
        return m ? parseFloat(m[1]) : 0;
      };
      return getExp(b.expEdu) - getExp(a.expEdu);
    }
    return 0;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage);
  const paginatedCandidates = sortedCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectRow = (id) => {
    setSelectedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = () => {
    if (Object.keys(selectedRows).length === paginatedCandidates.length && paginatedCandidates.length > 0) {
      setSelectedRows({});
    } else {
      const all = {};
      paginatedCandidates.forEach(c => { all[c.id] = true; });
      setSelectedRows(all);
    }
  };

  const handleOpenInterview = (name) => {
    setSelectedCandidateForInterview(name);
    setInterviewModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPoolSearchQuery('');
    setSelectedExpBracket('');
    setSkillsFilter({ reactNext: false, typescript: false, python: false, aws: false });
    setAvailability('');
    showToast('Filters reset to default view.', 'info');
  };

  const handleExportCsv = () => {
    const count = Object.keys(selectedRows).filter(k => selectedRows[k]).length;
    showToast(`Exporting ${count} selected candidates to CSV format (SRS REQ-5.4)... Download ready!`, 'success');
  };

  // ==========================================
  // RECOMMENDATIONS STATE (Screenshot 1)
  // ==========================================
  const [weights, setWeights] = useState({ experience: 40, skills: 40, culture: 20 });
  const [promptText, setPromptText] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [shortlistedMap, setShortlistedMap] = useState({
    dishan: true,
    amaya: true,
    nuwan: false
  });

  const handleToggleShortlist = (id) => {
    setShortlistedMap(prev => {
      const next = !prev[id];
      showToast(next ? 'Candidate added to AI Shortlist.' : 'Candidate removed from Shortlist.', 'info');
      return { ...prev, [id]: next };
    });
  };

  const handleAddTag = (tag) => {
    setPromptText(prev => (prev ? `${prev} ${tag}` : tag));
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      showToast('Neural rank engine successfully re-scored candidates based on natural language criteria!', 'success');
    }, 1200);
  };

  return (
    <div className="page-wrapper">
      {/* Top Tab Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 10, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className={`dossier-tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>Candidate Pipeline</span>
            <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: 9999, background: activeTab === 'pipeline' ? 'rgba(255,255,255,0.25)' : '#e2e8f0', color: activeTab === 'pipeline' ? '#ffffff' : '#475569' }}>
              {filteredCandidates.length} Results
            </span>
          </button>

          <button
            type="button"
            className={`dossier-tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Sparkles size={14} />
            <span>AI Recommendations</span>
            <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: 9999, background: activeTab === 'recommendations' ? 'rgba(255,255,255,0.25)' : '#ecfdf5', color: activeTab === 'recommendations' ? '#ffffff' : '#059669' }}>
              Engine 4.5
            </span>
          </button>
        </div>

        {/* Right Job Indicator */}
        <div className="job-position-selector">
          <select 
            className="job-selector-btn" 
            style={{ padding: '6px 12px', appearance: 'none', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', color: '#0f172a', fontWeight: 600, fontSize: '0.85rem' }}
            value={selectedJobRequisition}
            onChange={(e) => setSelectedJobRequisition(e.target.value)}
          >
            <option value="All Roles">All Roles</option>
            <option value="Sr. Frontend Engineer (Req #FE-802)">Sr. Frontend Engineer (Req #FE-802)</option>
            <option value="Cloud Architect (Req #CA-201)">Cloud Architect (Req #CA-201)</option>
          </select>
        </div>
      </div>

      {/* =========================================================
          TAB 1: CANDIDATE PIPELINE (Screenshot 2)
          ========================================================= */}
      {activeTab === 'pipeline' && (
        <div className="animate-fade-in">
          {/* Header Row */}
          <div className="page-title-row" style={{ marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidate Pipeline</h1>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.725rem', fontWeight: 700, padding: '4px 10px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={12} /> AI Model v4.2 Active
                </span>
              </div>
            </div>

            <button
              type="button"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 flex items-center justify-center gap-2"
              onClick={() => navigate(ROUTES.CV_UPLOAD)}
            >
              <UploadCloud size={17} />
              <span>Upload CV / Bulk Import</span>
            </button>
          </div>

          {/* 4 Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div className="mini-stat-card">
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>TOTAL SCREENED</span>
              <div className="stat-num-row">
                <span className="stat-big-num">1,420</span>
                <span className="stat-trend">↗ +18% vs. previous sprint</span>
              </div>
            </div>

            <div className="mini-stat-card">
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>AI SHORTLISTED</span>
              <div className="stat-num-row">
                <span className="stat-big-num">{filteredCandidates.length}</span>
                <span style={{ fontSize: '0.725rem', color: '#4f46e5', fontWeight: 700 }}>Top {((filteredCandidates.length / 1420) * 100).toFixed(1)}% of candidate pool</span>
              </div>
              <div className="bar-track" style={{ marginTop: 8 }}>
                <div className="bar-fill" style={{ width: `${Math.min(((filteredCandidates.length / 1420) * 100) * 10, 100)}%` }} />
              </div>
            </div>

            <div className="mini-stat-card">
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>AVERAGE MATCH</span>
              <div className="stat-num-row">
                <span className="stat-big-num">{filteredCandidates.length > 0 ? Math.round(filteredCandidates.reduce((acc, c) => acc + c.matchPct, 0) / filteredCandidates.length) : 0}%</span>
                <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 700 }}>● Confidence Score: High</span>
              </div>
              <div className="bar-track" style={{ marginTop: 8 }}>
                <div className="bar-fill" style={{ width: `${filteredCandidates.length > 0 ? Math.round(filteredCandidates.reduce((acc, c) => acc + c.matchPct, 0) / filteredCandidates.length) : 0}%`, background: '#10b981' }} />
              </div>
            </div>

            <div className="mini-stat-card">
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>PENDING REVIEW</span>
              <div className="stat-num-row">
                <span className="stat-big-num">{filteredCandidates.filter(c => c.status === 'Under Review').length}</span>
                <span style={{ fontSize: '0.725rem', color: '#d97706', fontWeight: 700 }}>● needs priority action</span>
              </div>
              <div className="bar-track" style={{ marginTop: 8 }}>
                <div className="bar-fill" style={{ width: '40%', background: '#f59e0b' }} />
              </div>
            </div>
          </div>

          {/* Main Grid: Filters Sidebar + Candidate Table */}
          <div className="pipeline-layout">
            <aside className="filters-sidebar">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Filter size={15} /> Filters
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Reset
                </button>
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Keyword Query</label>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ left: 10 }}>
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ height: 36, paddingLeft: 30, fontSize: '0.775rem' }}
                    placeholder="Skill, title, company..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: 8, display: 'block' }}>Experience Bracket</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['0-2 Yrs', '3-5 Yrs', '6+ Yrs'].map(brk => (
                    <button
                      key={brk}
                      type="button"
                      onClick={() => setSelectedExpBracket(brk)}
                      className={`pill-btn ${selectedExpBracket === brk ? 'active' : ''}`}
                      style={{ flex: 1, padding: '5px 0', fontSize: '0.7rem' }}
                    >
                      {brk}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: 8, display: 'block' }}>Verified Core Skills</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label className="checkbox-label" style={{ fontSize: '0.775rem' }}>
                    <input
                      type="checkbox"
                      checked={skillsFilter.reactNext}
                      onChange={e => setSkillsFilter(prev => ({ ...prev, reactNext: e.target.checked }))}
                    />
                    <span>React / Next.js</span>
                  </label>
                  <label className="checkbox-label" style={{ fontSize: '0.775rem' }}>
                    <input
                      type="checkbox"
                      checked={skillsFilter.typescript}
                      onChange={e => setSkillsFilter(prev => ({ ...prev, typescript: e.target.checked }))}
                    />
                    <span>TypeScript</span>
                  </label>
                  <label className="checkbox-label" style={{ fontSize: '0.775rem' }}>
                    <input
                      type="checkbox"
                      checked={skillsFilter.python}
                      onChange={e => setSkillsFilter(prev => ({ ...prev, python: e.target.checked }))}
                    />
                    <span>Python / AI Frameworks</span>
                  </label>
                  <label className="checkbox-label" style={{ fontSize: '0.775rem' }}>
                    <input
                      type="checkbox"
                      checked={skillsFilter.aws}
                      onChange={e => setSkillsFilter(prev => ({ ...prev, aws: e.target.checked }))}
                    />
                    <span>AWS & Cloud Native</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: 8, display: 'block' }}>Availability</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Immediate', '2 Weeks', '1 Month'].map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvailability(av)}
                      className={`pill-btn ${availability === av ? 'active' : ''}`}
                      style={{ fontSize: '0.7rem', padding: '4px 10px' }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Candidate Table Card */}
            <div className="pipeline-table-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="input-wrapper" style={{ width: 240 }}>
                    <span className="input-icon" style={{ left: 10 }}>
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      style={{ height: 34, paddingLeft: 30, fontSize: '0.775rem' }}
                      placeholder="Search shortlisted pool..."
                      value={poolSearchQuery}
                      onChange={(e) => setPoolSearchQuery(e.target.value)}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{filteredCandidates.length} Results</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Sort:</span>
                  <select 
                    className="job-selector-btn" 
                    style={{ padding: '5px 10px', fontSize: '0.75rem', appearance: 'none', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', color: '#0f172a', fontWeight: 600 }}
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="Highest AI Match">Highest AI Match</option>
                    <option value="Name A-Z">Name A-Z</option>
                    <option value="Experience (High to Low)">Experience (High to Low)</option>
                  </select>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 flex items-center justify-center"
                    onClick={handleExportCsv}
                    title="Export CSV (REQ-5.4)"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="candidate-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 36 }}>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={paginatedCandidates.length > 0 && Object.keys(selectedRows).length === paginatedCandidates.length}
                        />
                      </th>
                      <th>CANDIDATE PROFILE</th>
                      <th>AI MATCH INDEX</th>
                      <th>CORE SKILLS & STACK</th>
                      <th>EXP / EDUCATION</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCandidates.map(candidate => (
                      <tr key={candidate.id} style={{ background: selectedRows[candidate.id] ? '#f8fafc' : 'transparent' }}>
                        <td>
                          <input
                            type="checkbox"
                            checked={!!selectedRows[candidate.id]}
                            onChange={() => handleSelectRow(candidate.id)}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={candidate.avatar} alt={candidate.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.8125rem' }}>{candidate.name}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{candidate.title}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 110 }}>
                            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <Sparkles size={11} /> {candidate.matchPct}% AI Match
                            </span>
                            <div className="bar-track">
                              <div className="bar-fill" style={{ width: `${candidate.matchPct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {candidate.skills.map(s => (
                              <span key={s} className="token-pill" style={{ padding: '2px 7px', fontSize: '0.6875rem' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: '#334155' }}>{candidate.expEdu}</span>
                        </td>
                        <td>
                          <span className={`status-pill ${candidate.status === 'Shortlisted' ? 'shortlisted' : candidate.status === 'Under Review' ? 'under-review' : 'interviewing'}`}>
                            {candidate.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <button
                              type="button"
                              className="link-button"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => navigate(`/candidates/${candidate.id}`)}
                            >
                              View Profile
                            </button>
                            <button
                              type="button"
                              className="pill-btn active"
                              style={{ padding: '4px 10px', fontSize: '0.725rem' }}
                              onClick={() => handleOpenInterview(candidate.name)}
                            >
                              Invite
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} shortlisted candidates
                  </span>
                  <button
                    type="button"
                    className="link-button"
                    style={{ fontSize: '0.75rem' }}
                    onClick={handleExportCsv}
                  >
                    Bulk Export
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    className="link-button"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => handleOpenInterview('Selected Candidates')}
                  >
                    Move to Interview
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button 
                    type="button" 
                    className="pill-btn" 
                    style={{ padding: '3px 8px', fontSize: '0.725rem' }}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >‹</button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button 
                      key={idx}
                      type="button" 
                      className={`pill-btn ${currentPage === idx + 1 ? 'active' : ''}`} 
                      style={{ padding: '3px 9px', fontSize: '0.725rem' }}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  
                  <button 
                    type="button" 
                    className="pill-btn" 
                    style={{ padding: '3px 8px', fontSize: '0.725rem' }}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >›</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: AI RECOMMENDATIONS (Screenshot 1)
          ========================================================= */}
      {activeTab === 'recommendations' && (
        <div className="animate-fade-in">
          {/* Header */}
          <div className="page-title-group">
            <div className="page-engine-badge">
              <Sparkles size={14} />
              <span>NEURAL RANK ENGINE 4.5 • SYNCHRONIZED 4M AGO</span>
            </div>
            <div className="page-title-row">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Candidate Recommendations</h1>
                <p className="page-subtitle">
                  Multi-agent neural matching tailored for {selectedJobRequisition === 'All Roles' ? 'all' : selectedJobRequisition} role based on semantic ontology and code benchmarks.
                </p>
              </div>
            </div>
          </div>

          {/* Top Section: Weighting Card + 3 Stats */}
          <div className="recommendations-top-grid">
            <div className="weighting-card">
              <div className="weighting-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f5f3ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Vector Weighting Distribution</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setWeightsModalOpen(true)}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Sliders size={13} />
                  <span>Customize Weights</span>
                </button>
              </div>

              <div className="weight-split-bar">
                <div className="bar-exp" style={{ width: `${weights.experience}%` }} />
                <div className="bar-skills" style={{ width: `${weights.skills}%` }} />
                <div className="bar-culture" style={{ width: `${weights.culture}%` }} />
              </div>

              <div className="weight-labels-row">
                <div className="weight-item-dot">
                  <span className="lbl" style={{ color: '#4f46e5' }}>● Experience</span>
                  <span className="pct">{weights.experience}%</span>
                </div>
                <div className="weight-item-dot">
                  <span className="lbl" style={{ color: '#3b82f6' }}>● Skills & Mastery</span>
                  <span className="pct">{weights.skills}%</span>
                </div>
                <div className="weight-item-dot">
                  <span className="lbl" style={{ color: '#10b981' }}>● Culture & Fit</span>
                  <span className="pct">{weights.culture}%</span>
                </div>
              </div>

              <div className="semantic-tokens-row">
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Semantic Tokens:</span>
                <span className="token-pill">📍 Next.js 14 App Router</span>
                <span className="token-pill">💻 TypeScript Strict</span>
                <span className="token-pill">📦 Micro-Frontends</span>
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, color: '#059669', fontSize: '0.7rem', fontWeight: 700 }}>
                  <CheckCircle2 size={13} /> Triple Validated
                </span>
              </div>
            </div>

            <div className="mini-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>SCREENED CVS</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} />
                </div>
              </div>
              <div className="stat-num-row">
                <span className="stat-big-num">142</span>
                <span className="stat-trend">↑+38 today</span>
              </div>
            </div>

            <div className="mini-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>AI SHORTLISTED</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={16} />
                </div>
              </div>
              <div className="stat-num-row">
                <span className="stat-big-num">5</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: 9999 }}>Top 3.5%</span>
              </div>
            </div>

            <div className="mini-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>AVG TOP SCORE</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} />
                </div>
              </div>
              <div className="stat-num-row">
                <span className="stat-big-num">93.6%</span>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#059669' }}>High Confidence</span>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '28px 0 16px 0', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Ranked Recommendations</h2>
              <span style={{ background: '#f5f3ff', color: '#4f46e5', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>
                Live Model Analysis
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Ranking Strategy: <strong style={{ color: '#0f172a' }}>Balanced Semantic Match</strong>
            </span>
          </div>

          {/* 3 Ranked Candidate Cards */}
          <div className="ranked-cards-grid">
            <div className="ranked-card">
              <div className="ranked-badge-top">
                <span className="ai-choice-tag top-1">
                  <Sparkles size={12} />
                  <span>#1 AI TOP CHOICE</span>
                </span>
                <span className="fit-pct-pill">98% <span>FIT</span></span>
              </div>

              <div className="candidate-profile-row">
                <div className="candidate-img-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Dishan Perera"
                    className="candidate-img"
                  />
                  <span className="verified-tick-badge"><Check size={10} /></span>
                </div>
                <div className="candidate-meta">
                  <h4>Dishan Perera</h4>
                  <p>Senior Frontend Specialist</p>
                  <div className="candidate-details-pills">
                    <span>💼 8 yrs exp</span>
                    <span>•</span>
                    <span>📍 Colombo (Hybrid)</span>
                  </div>
                </div>
              </div>

              <div className="score-bars-list">
                <div className="score-bar-item">
                  <div className="score-bar-labels">
                    <span>System Architecture</span>
                    <strong>100%</strong>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '100%' }} /></div>
                </div>
                <div className="score-bar-item">
                  <div className="score-bar-labels">
                    <span>TypeScript Strictness</span>
                    <strong>95%</strong>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '95%' }} /></div>
                </div>
                <div className="score-bar-item">
                  <div className="score-bar-labels">
                    <span>Culture & Leadership</span>
                    <strong>92%</strong>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '92%' }} /></div>
                </div>
              </div>

              <div className="why-ai-recommends-box">
                <div className="why-ai-title">
                  <Sparkles size={12} />
                  <span>Why AI Recommends</span>
                </div>
                <p className="why-ai-desc">
                  Exceeds Next.js 14 App Router requirements by +2.4 years. Proven technical leadership in 4 enterprise migrations with sub-second page performance.
                </p>
              </div>

              <div className="card-actions-row">
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 flex items-center justify-center gap-2"
                  style={{ flex: 1, height: 42, fontSize: '0.8125rem' }}
                  onClick={() => handleOpenInterview('Dishan Perera')}
                >
                  <Calendar size={14} />
                  <span>Invite to Interview</span>
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 flex items-center justify-center"
                  style={{ width: 42, height: 42, padding: 0 }}
                  onClick={() => navigate('/candidates/1')}
                  title="View Dossier"
                >
                  <Scale size={16} />
                </button>
              </div>
            </div>

            <div className="ranked-card">
              <div className="ranked-badge-top">
                <span className="ai-choice-tag strong">
                  <Sparkles size={12} />
                  <span>STRONG TECHNICAL FIT</span>
                </span>
                <span className="fit-pct-pill">94% <span>FIT</span></span>
              </div>

              <div className="candidate-profile-row">
                <div className="candidate-img-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                    alt="Amaya Fernando"
                    className="candidate-img"
                  />
                  <span className="verified-tick-badge"><Check size={10} /></span>
                </div>
                <div className="candidate-meta">
                  <h4>Amaya Fernando</h4>
                  <p>Design Systems & UI Architect</p>
                  <div className="candidate-details-pills">
                    <span>💼 5 yrs exp</span>
                    <span>•</span>
                    <span>📍 Remote (Global)</span>
                  </div>
                </div>
              </div>

              <div className="score-bars-list">
                <div className="score-bar-item">
                  <div className="score-bar-labels">
                    <span>Design System Scalability</span>
                    <strong>98%</strong>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '98%' }} /></div>
                </div>
                <div className="score-bar-item">
                  <div className="score-bar-labels">
                    <span>React 18 Concurrent</span>
                    <strong>93%</strong>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '93%' }} /></div>
                </div>
                <div className="score-bar-item">
                  <div className="score-bar-labels">
                    <span>WCAG AAA Accessibility</span>
                    <strong>96%</strong>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '96%' }} /></div>
                </div>
              </div>

              <div className="why-ai-recommends-box">
                <div className="why-ai-title">
                  <Sparkles size={12} />
                  <span>Why AI Recommends</span>
                </div>
                <p className="why-ai-desc">
                  Extensive enterprise UI component libraries experience. Authored design token workflows serving 40+ engineering teams seamlessly.
                </p>
              </div>

              <div className="card-actions-row">
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 flex items-center justify-center gap-2"
                  style={{ flex: 1, height: 42, fontSize: '0.8125rem' }}
                  onClick={() => handleOpenInterview('Amaya Fernando')}
                >
                  <Send size={14} />
                  <span>Invite</span>
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 flex items-center justify-center"
                  style={{ flex: 1, height: 42, fontSize: '0.8125rem' }}
                  onClick={() => navigate('/candidates/6')}
                >
                  <UserCheck size={14} />
                  <span>Profile</span>
                </button>
              </div>
            </div>

            <div className="ranked-card">
              <div className="ranked-badge-top">
                <span className="ai-choice-tag potential">
                  <Sparkles size={12} />
                  <span>HIGH POTENTIAL</span>
                </span>
                <span className="fit-pct-pill">89% <span>FIT</span></span>
              </div>

              <div className="candidate-profile-row">
                <div className="candidate-img-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Nuwan Senanayake"
                    className="candidate-img"
                  />
                  <span className="verified-tick-badge"><Check size={10} /></span>
                </div>
                <div className="candidate-meta">
                  <h4>Nuwan Senanayake</h4>
                  <p>Full Stack JS Engineer</p>
                  <div className="candidate-details-pills">
                    <span>💼 4 yrs exp</span>
                    <span>•</span>
                    <span>📍 Kandy (On-site)</span>
                  </div>
                </div>
              </div>

              <div className="score-bars-list">
                <div className="score-bar-item">
                  <div className="score-bar-labels">
                    <span>Algorithmic Benchmark</span>
                    <strong>96th %ile</strong>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '96%' }} /></div>
                </div>
                <div className="score-bar-item">
                  <div className="score-bar-labels">
                    <span>React + NestJS Backend</span>
                    <strong>91%</strong>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '91%' }} /></div>
                </div>
                <div className="score-bar-item">
                  <div className="score-bar-labels">
                    <span>Build Pipeline & CI/CD</span>
                    <strong>88%</strong>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '88%' }} /></div>
                </div>
              </div>

              <div className="why-ai-recommends-box">
                <div className="why-ai-title">
                  <Sparkles size={12} />
                  <span>Why AI Recommends</span>
                </div>
                <p className="why-ai-desc">
                  Strong full-stack capability with 96th percentile benchmark. Ideal versatility for rapid end-to-end prototyping and distributed team execution.
                </p>
              </div>

              <div className="card-actions-row">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 flex items-center justify-center"
                  style={{ flex: 1, height: 42, fontSize: '0.8125rem' }}
                  onClick={() => navigate('/candidates/7')}
                >
                  <UserCheck size={14} />
                  <span>View Profile</span>
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 flex items-center justify-center gap-2"
                  style={{ flex: 1, height: 42, fontSize: '0.8125rem', background: shortlistedMap.nuwan ? '#10b981' : undefined }}
                  onClick={() => handleToggleShortlist('nuwan')}
                >
                  <span>{shortlistedMap.nuwan ? 'Shortlisted ✓' : 'Shortlist'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Discrepancy Matrix & Refinement */}
          <div className="matrix-refinement-grid">
            <div className="matrix-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f5f3ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Neural Vector Discrepancy Matrix</h3>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: 9999 }}>
                  ● Deterministic Match
                </span>
              </div>

              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Semantic Match</th>
                    <th>Code Repos</th>
                    <th>Experience Fit</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="matrix-dot-green" />
                      <strong>Dishan Perera</strong>
                    </td>
                    <td>99.2% (App Router)</td>
                    <td>Top 1.2% GitHub</td>
                    <td style={{ color: '#059669', fontWeight: 700 }}>+2.4 yrs surplus</td>
                    <td style={{ fontWeight: 700 }}>0.994</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="matrix-dot-green" />
                      <strong>Amaya Fernando</strong>
                    </td>
                    <td>95.8% (UI Patterns)</td>
                    <td>Storybook Core Contributor</td>
                    <td style={{ color: '#2563eb', fontWeight: 700 }}>Exact Match (5 yrs)</td>
                    <td style={{ fontWeight: 700 }}>0.981</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="matrix-dot-green" />
                      <strong>Nuwan Senanayake</strong>
                    </td>
                    <td>91.4% (Fullstack JS)</td>
                    <td>Leetcode 96th %ile</td>
                    <td style={{ color: '#d97706', fontWeight: 700 }}>-1.0 yr delta (Offset)</td>
                    <td style={{ fontWeight: 700 }}>0.963</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, marginTop: 16, fontSize: '0.725rem', color: '#64748b', lineHeight: 1.45 }}>
                <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <strong style={{ color: '#1e293b' }}>Anti-hallucination Verification:</strong> All candidate certifications, repository contributions, and tenure claims are verified against immutable ledger endpoints and cross-referenced with public git metadata.
                </div>
              </div>
            </div>

            <div className="refinement-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Sparkles size={18} color="#4f46e5" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>AI Matching Refinement</h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45 }}>
                Need more variations or specialized focus? Re-run neural matching with custom recruiter criteria in natural language.
              </p>

              <textarea
                className="prompt-textarea"
                placeholder="e.g. Prioritize candidates who have hands-on experience refactoring massive legacy codebases into server components and state machines..."
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.6875rem', color: '#64748b', marginBottom: 8 }}>
                <span>Prompt Optimizer: <strong style={{ color: '#10b981' }}>Active</strong></span>
              </div>

              <div className="quick-tags-row">
                <button type="button" className="quick-tag-btn" onClick={() => handleAddTag('Prioritize Microfrontends')}>
                  + Prioritize Microfrontends
                </button>
                <button type="button" className="quick-tag-btn" onClick={() => handleAddTag('Startup Leadership Exp')}>
                  + Startup Leadership Exp
                </button>
                <button type="button" className="quick-tag-btn" onClick={() => handleAddTag('Sub-second LCP Focus')}>
                  + Sub-second LCP Focus
                </button>
              </div>

              <button
                type="button"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 flex items-center justify-center gap-2"
                style={{ marginTop: 'auto', height: 44 }}
                onClick={handleRegenerate}
                disabled={isRegenerating}
              >
                <RefreshCw size={15} className={isRegenerating ? 'spinner' : ''} />
                <span>{isRegenerating ? 'Neural Rescoring...' : 'Regenerate Recommendations'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CustomizeWeightsModal
        isOpen={weightsModalOpen}
        onClose={() => setWeightsModalOpen(false)}
        weights={weights}
        onSaveWeights={(newWeights) => {
          setWeights(newWeights);
          showToast('Vector weights applied! Neural ranking rebalanced.', 'success');
        }}
      />

      <ScheduleInterviewModal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        candidateName={selectedCandidateForInterview}
        onSuccess={(msg) => showToast(msg, 'success')}
      />
    </div>
  );
};

export default CandidateListPage;
