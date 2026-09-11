import { Briefcase, MapPin, Users } from 'lucide-react';

const STATUS_BADGE = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-slate-100 text-slate-500',
  Closed: 'bg-red-100 text-red-600',
};

/**
 * Compact job summary card — for surfaces that show jobs outside the
 * full table (e.g. the dashboard's "recent postings" widget).
 */
const JobCard = ({ job, onClick }) => {
  return (
    <button
      onClick={() => onClick?.(job)}
      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-shadow hover:shadow-sm"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-900">{job.title}</p>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[job.status]}`}>
          {job.status}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Briefcase size={12} /> {job.department}</span>
        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
        <span className="flex items-center gap-1"><Users size={12} /> {job.candidates} candidates</span>
      </div>
    </button>
  );
};

export default JobCard;
