import { Briefcase, MapPin, Clock, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';

const STATUS_BADGE = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-slate-100 text-slate-500',
  Closed: 'bg-red-100 text-red-600',
};

/**
 * Read-only job details view: header + stats + description + top matches.
 * Used by JobDetailsPage. Edit/Delete handlers are passed in as props.
 */
const JobDetails = ({ job, onEdit, onDelete }) => {
  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[job.status]}`}>
              {job.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Briefcase size={14} /> {job.department}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {job.type}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Posted {job.posted}</span>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Button variant="secondary" icon={Pencil} onClick={onEdit}>Edit job</Button>
          <Button variant="dangerOutline" icon={Trash2} onClick={onDelete}>Delete</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Total candidates</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{job.candidates}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Highly recommended</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{job.highlyRecommended ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Avg. match score</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{job.avgMatch ?? '—'}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Days open</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{job.daysOpen ?? '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card title="Job description">
          <p className="mb-3.5 text-sm leading-relaxed text-slate-700">{job.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {(job.skills ?? []).map((skill) => (
              <span key={skill} className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                {skill}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Top matches" noPadding>
          {(job.topMatches ?? []).map((c) => (
            <div key={c.name} className="flex items-center justify-between border-b border-slate-100 px-5 py-3 last:border-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-900">
                  {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <p className="text-sm font-semibold text-slate-800">{c.name}</p>
              </div>
              <p className="text-sm font-bold text-blue-600">{c.match}%</p>
            </div>
          ))}
          {(!job.topMatches || job.topMatches.length === 0) && (
            <p className="px-5 py-6 text-center text-sm text-slate-400">No candidates screened yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default JobDetails;
