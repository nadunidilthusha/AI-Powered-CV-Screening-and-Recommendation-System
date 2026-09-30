import {
  useEffect,
  useState,
} from 'react';

import reportService from '../../../services/reportService';

const CandidateRanking = ({
  selectedJob,
  filters,
}) => {
  const [candidates, setCandidates] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const loadCandidates =
      async () => {
        if (!selectedJob) {
          setCandidates([]);
          setError('');
          return;
        }

        try {
          setLoading(true);
          setError('');

          const response =
            await reportService
              .getCandidateRanking(
                selectedJob,
                filters
              );

          const payload =
            response?.data?.data ??
            response?.data;

          setCandidates(
            Array.isArray(
              payload?.candidates
            )
              ? payload.candidates
              : []
          );
        } catch (err) {
          console.error(
            'Failed to load candidate ranking:',
            err
          );

          setCandidates([]);

          setError(
            err?.response?.data
              ?.message ||
              'Unable to load candidate rankings.'
          );
        } finally {
          setLoading(false);
        }
      };

    loadCandidates();
  }, [selectedJob, filters]);

  const getInitials = (
    name = ''
  ) => {
    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      return 'CV';
    }

    return parts
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join('');
  };

  const getRecommendationClasses =
    (status) => {
      if (
        status ===
        'Highly Recommended'
      ) {
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      }

      if (status === 'Recommended') {
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      }

      if (
        status ===
        'Not Recommended'
      ) {
        return 'bg-red-50 text-red-600 border border-red-200';
      }

      return 'bg-slate-100 text-slate-600 border border-slate-200';
    };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[850px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="w-24 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rank
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Candidate
              </th>

              <th className="w-32 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Match %
              </th>

              <th className="w-56 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                AI Recommendation
              </th>

              <th className="w-64 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Missing Skills
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {!selectedJob ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-slate-500"
                >
                  Select a job to view
                  candidate rankings.
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-slate-500"
                >
                  Loading candidate
                  rankings...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : candidates.length > 0 ? (
              candidates.map(
                (candidate) => (
                  <tr
                    key={
                      candidate.candidateId
                    }
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      #{candidate.rank}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                          {getInitials(
                            candidate.name
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {
                              candidate.name
                            }
                          </p>

                          <p className="text-xs text-slate-500">
                            {candidate.email ||
                              'No email available'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-base font-bold text-blue-600">
                      {
                        candidate.matchPercentage
                      }
                      %
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRecommendationClasses(
                          candidate.recommendationStatus
                        )}`}
                      >
                        {
                          candidate.recommendationStatus
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {candidate
                        .missingSkills
                        ?.length === 0 ? (
                        <span className="text-sm text-slate-400">
                          No critical gaps
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(
                            candidate
                              .missingSkills ||
                            []
                          ).map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={`${skill}-${index}`}
                                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No candidates match
                  your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateRanking;