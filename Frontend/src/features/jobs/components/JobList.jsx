import { useMemo, useState } from 'react';
import { Search, Eye, Pencil, Trash2, Briefcase, Users } from 'lucide-react';
import Table from '../../../components/common/Table/Table';

const STATUS_TABS = ['All', 'Active', 'Draft', 'Closed'];

const STATUS_BADGE = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-slate-100 text-slate-500',
  Closed: 'bg-red-100 text-red-600',
};

/**
 * Job postings table: search, department filter, status tabs, and
 * view / edit / delete row actions.
 *
 * jobs: array of job objects
 * onView / onEdit / onDelete: (job) => void
 */
const JobList = ({ jobs, onView, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [statusTab, setStatusTab] = useState('All');

  const departments = useMemo(() => [...new Set(jobs.map((j) => j.department))], [jobs]);

  const filtered = jobs.filter(
    (j) =>
      (statusTab === 'All' || j.status === statusTab) &&
      (!department || j.department === department) &&
      (!search || j.title.toLowerCase().includes(search.toLowerCase()))
  );

  const columns = [
    {
      key: 'title',
      header: 'Job title',
      render: (job) => (
        <div>
          <p className="font-semibold text-slate-900">{job.title}</p>
          <p className="mt-0.5 text-xs text-slate-400">{job.level}</p>
        </div>
      ),
    },
    { key: 'department', header: 'Department' },
    { key: 'type', header: 'Type' },
    {
      key: 'candidates',
      header: 'Candidates',
      render: (job) => (
        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
          <Users size={14} className="text-slate-400" />
          {job.candidates}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (job) => (
        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[job.status]}`}>
          {job.status}
        </span>
      ),
    },
    { key: 'posted', header: 'Posted' },
    {
      key: 'actions',
      header: '',
      render: (job) => (
        <div className="flex justify-end gap-1.5">
          <button
            title="View"
            onClick={(e) => { e.stopPropagation(); onView(job); }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600"
          >
            <Eye size={15} />
          </button>
          <button
            title="Edit"
            onClick={(e) => { e.stopPropagation(); onEdit(job); }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600"
          >
            <Pencil size={15} />
          </button>
          <button
            title="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(job); }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="relative w-full max-w-[280px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job postings…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <div className="ml-auto flex gap-1 rounded-lg bg-slate-100 p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab} ({tab === 'All' ? jobs.length : jobs.filter((j) => j.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <Table
          columns={columns}
          data={filtered}
          onRowClick={onView}
          emptyState={
            <div className="flex flex-col items-center gap-3">
              <Briefcase size={36} className="text-slate-300" />
              <div>
                <p className="font-semibold text-slate-700">No job postings match</p>
                <p className="mt-0.5 text-sm text-slate-400">Try a different filter, or create a new posting.</p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default JobList;
