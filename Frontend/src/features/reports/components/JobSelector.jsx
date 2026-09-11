import { ChevronDown } from 'lucide-react';

const JobSelector = () => {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-slate-500 uppercase mb-1">Select Job</label>
      <div className="relative w-64">
        <select className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-medium py-2.5 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <option>Software Engineer (Req #FE-802)</option>
          <option>Product Manager (Req #PM-105)</option>
          <option>UI/UX Designer (Req #DE-404)</option>
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default JobSelector;