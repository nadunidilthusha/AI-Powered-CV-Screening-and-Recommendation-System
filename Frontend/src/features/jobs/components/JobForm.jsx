import { useState } from 'react';
import { X, Save } from 'lucide-react';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Save as draft' },
  { value: 'Active', label: 'Active & screening' },
  { value: 'Closed', label: 'Closed' },
];

const STATUS_SELECTED_CLASSES = {
  Draft: 'border-slate-400 bg-slate-100 text-slate-600',
  Active: 'border-blue-600 bg-blue-50 text-blue-600',
  Closed: 'border-red-600 bg-red-50 text-red-600',
};

/**
 * Shared job form used by both CreateJobPage and EditJobPage.
 * Pass `initialData` to pre-fill for editing; omit it to create a new job.
 */
const JobForm = ({ initialData = null, onSubmit, onCancel, submitLabel = 'Save job', loading = false }) => {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [department, setDepartment] = useState(initialData?.department ?? 'Engineering');
  const [type, setType] = useState(initialData?.type ?? 'Full-time');
  const [location, setLocation] = useState(initialData?.location ?? '');
  const [level, setLevel] = useState(initialData?.level ?? 'Entry level');
  const [salaryMin, setSalaryMin] = useState(initialData?.salaryMin ?? '');
  const [salaryMax, setSalaryMax] = useState(initialData?.salaryMax ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [status, setStatus] = useState(initialData?.status ?? 'Draft');
  const [skills, setSkills] = useState(initialData?.skills ?? []);
  const [skillDraft, setSkillDraft] = useState('');

  const addSkill = (e) => {
    if (e.key !== 'Enter' || !skillDraft.trim()) return;
    e.preventDefault();
    setSkills((prev) => [...prev, skillDraft.trim()]);
    setSkillDraft('');
  };

  const removeSkill = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: title.trim() || 'Untitled role',
      department,
      type,
      location: location.trim() || 'Not specified',
      level,
      salaryMin,
      salaryMax,
      description,
      status,
      skills,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Job title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Backend Engineer" />

        <Input as="select" label="Department" value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option>Engineering</option>
          <option>Design</option>
          <option>Product</option>
          <option>Marketing</option>
          <option>Operations</option>
        </Input>

        <Input as="select" label="Employment type" value={type} onChange={(e) => setType(e.target.value)}>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </Input>

        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Colombo · Hybrid" />

        <Input as="select" label="Experience level" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option>Entry level</option>
          <option>Mid level</option>
          <option>Senior level</option>
          <option>Lead / Principal</option>
        </Input>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-800">
            Salary range <span className="ml-1.5 font-normal text-slate-400">(monthly, LKR)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="Min"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <span className="text-slate-400">—</span>
            <input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="Max"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Skills tag input */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-800">
            Required skills <span className="ml-1.5 font-normal text-slate-400">press Enter to add each one</span>
          </label>
          <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            {skills.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="flex items-center gap-1.5 rounded-md bg-blue-50 py-1 pl-2.5 pr-1.5 text-xs font-semibold text-blue-900"
              >
                {skill}
                <button type="button" onClick={() => removeSkill(i)} className="text-blue-900/60 hover:text-blue-900">
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={skillDraft}
              onChange={(e) => setSkillDraft(e.target.value)}
              onKeyDown={addSkill}
              placeholder="Type a skill and press Enter…"
              className="min-w-[140px] flex-1 bg-transparent p-1 text-sm outline-none"
            />
          </div>
        </div>

        <Input
          as="textarea"
          label="Job description"
          className="md:col-span-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe responsibilities, requirements, and what a strong candidate looks like. This text is what the AI agents compare CVs against, so be specific."
        />

        {/* Status toggle */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-800">Status</label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`flex-1 rounded-lg border-[1.5px] px-3.5 py-2.5 text-center text-sm font-semibold transition-colors ${
                  status === opt.value ? STATUS_SELECTED_CLASSES[opt.value] : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" icon={Save} loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
