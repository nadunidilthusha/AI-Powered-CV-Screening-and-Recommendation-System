import React, { useState } from 'react';
import { Calendar, Video, X } from 'lucide-react';

export const ScheduleInterviewModal = ({ isOpen, onClose, candidateName, onSuccess }) => {
  const [round, setRound] = useState('Technical System Architecture');
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('14:30');
  const [interviewer, setInterviewer] = useState('Sarah Jenkins (Lead Recruiter) & Staff Arch');
  const [notes, setNotes] = useState('Focus on Next.js 14 App Router migration and Micro-frontend governance.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSuccess?.(`Interview scheduled successfully for ${candidateName || 'candidate'}! Calendar invite sent.`);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: 520, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Schedule Technical Interview</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Candidate: <strong>{candidateName || 'Dishan Perera'}</strong></p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Interview Stage / Round</label>
            <select
              className="form-input"
              style={{ paddingLeft: 14 }}
              value={round}
              onChange={e => setRound(e.target.value)}
            >
              <option value="Technical System Architecture">Round 1: Technical System Architecture (60m)</option>
              <option value="Live Code & Algorithmic Rigor">Round 2: Live Code & Algorithmic Rigor (60m)</option>
              <option value="Leadership & Culture Alignment">Round 3: Leadership & Culture Alignment (45m)</option>
            </select>
          </div>

          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                style={{ paddingLeft: 14 }}
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time (IST)</label>
              <input
                type="time"
                className="form-input"
                style={{ paddingLeft: 14 }}
                value={time}
                onChange={e => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Interviewers</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 14 }}
              value={interviewer}
              onChange={e => setInterviewer(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Interview Focus / Notes</label>
            <textarea
              className="form-input"
              style={{ padding: 12, height: 70, resize: 'none' }}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', padding: '8px 12px', borderRadius: 8, color: '#166534', fontSize: '0.75rem', marginBottom: 20 }}>
            <Video size={16} color="#16a34a" />
            <span>Encrypted Google Meet & Calendar invitations will be automatically dispatched.</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ height: 44 }} disabled={submitting}>
              {submitting ? 'Dispatching Invitation...' : 'Confirm & Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ScheduleInterviewModal;
