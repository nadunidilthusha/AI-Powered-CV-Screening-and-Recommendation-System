const mockData = [
  {
    id: 1,
    rank: '#1',
    initials: 'AN',
    name: 'Amal Niroshan',
    email: 'amal.n@example.com',
    match: 94,
    recommendation: 'Highly Recommended',
    missingSkills: [],
  },
  {
    id: 2,
    rank: '#2',
    initials: 'SP',
    name: 'Shalini Perera',
    email: 'shalini.p@example.com',
    match: 88,
    recommendation: 'Highly Recommended',
    missingSkills: ['Docker'],
  },
  {
    id: 3,
    rank: '#3',
    initials: 'DM',
    name: 'Dilan Madushanka',
    email: 'dilan.m@example.com',
    match: 79,
    recommendation: 'Recommended',
    missingSkills: ['AWS', 'Redis'],
  },
];

const CandidateRanking = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Rank</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Match %</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-56">AI Recommendation</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-64">Missing Skills</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {mockData.map((candidate) => (
            <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-slate-900">{candidate.rank}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {candidate.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{candidate.name}</p>
                    <p className="text-xs text-slate-500">{candidate.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-base font-bold text-blue-600">{candidate.match}%</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  candidate.recommendation === 'Highly Recommended' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {candidate.recommendation}
                </span>
              </td>
              <td className="px-6 py-4">
                {candidate.missingSkills.length === 0 ? (
                  <span className="text-sm text-slate-400">No critical gaps</span>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {candidate.missingSkills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateRanking;