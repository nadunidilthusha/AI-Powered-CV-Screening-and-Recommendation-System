import {
  BriefcaseBusiness,
  CircleCheckBig,
  Users,
  FileCheck2,
} from 'lucide-react';

const statistics = [
  {
    title: 'Total Job Postings',
    value: '12',
    helperValue: '+2',
    helperText: 'this month',
    helperColor: 'text-green-600',
    icon: BriefcaseBusiness,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    title: 'Active Jobs',
    value: '8',
    helperValue: '67%',
    helperText: 'of total jobs',
    helperColor: 'text-blue-600',
    icon: CircleCheckBig,
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50',
  },
  {
    title: 'Total Candidates',
    value: '124',
    helperValue: '+18',
    helperText: 'new candidates',
    helperColor: 'text-green-600',
    icon: Users,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
  },
  {
    title: 'CVs Processed',
    value: '105',
    helperValue: '19',
    helperText: 'pending / processing',
    helperColor: 'text-blue-600',
    icon: FileCheck2,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
  },
];

const StatisticsCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statistics.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span className={`font-semibold ${item.helperColor}`}>
                    {item.helperValue}
                  </span>

                  <span className="text-slate-500">
                    {item.helperText}
                  </span>
                </div>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
              >
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className={item.iconColor}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;