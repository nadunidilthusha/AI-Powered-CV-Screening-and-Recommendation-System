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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
              Rank
            </th>

            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Candidate
            </th>

            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
              Match %
            </th>

            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-56">
              AI Recommendation
            </th>

            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-64">
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
          ) : candidates.length >
            0 ? (
            candidates.map(
              (candidate) => (
                <tr
                  key={
                    candidate.candidateId
                  }
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    #{candidate.rank}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {getInitials(
                          candidate.name
                        )}
                      </div>

                      <div>
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
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRecommendationClasses(
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
                      <div className="flex gap-2 flex-wrap">
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
                              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm"
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
  );
};

export default CandidateRanking;