import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CircleCheckBig,
  Info,
  ListChecks,
} from 'lucide-react';

import DropZone from '../../features/cv-upload/components/DropZone';
import FileSelector from '../../features/cv-upload/components/FileSelector';
import UploadProgress from '../../features/cv-upload/components/UploadProgress';
import FileValidationMessage from '../../features/cv-upload/components/FileValidationMessage';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const CvUploadPage = () => {
  const navigate = useNavigate();

  const [selectedJob, setSelectedJob] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // select -> uploading -> validated
  const [stage, setStage] = useState('select');

  const handleFilesSelected = (files) => {
    setSelectedFiles((currentFiles) => [
      ...currentFiles,
      ...files,
    ]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter(
        (_, index) => index !== indexToRemove
      )
    );
  };

  const isValidFile = (file) => {
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    const validSize =
      file.size <= MAX_FILE_SIZE;

    return isPdf && validSize;
  };

  const validFiles =
    selectedFiles.filter(isValidFile);

  const invalidFiles =
    selectedFiles.filter(
      (file) => !isValidFile(file)
    );

  const handleUpload = () => {
    setStage('uploading');
  };

  const handleBackToFiles = () => {
    setStage('select');
  };

  const handleStartScreening = () => {
    navigate('/candidates');
  };

  /*
    Temporary frontend simulation:
    After showing upload progress for 2.5 seconds,
    move to Validation Complete.

    Later this can be replaced with the real backend/API response.
  */
  useEffect(() => {
    if (stage !== 'uploading') {
      return undefined;
    }

    const timer = setTimeout(() => {
      setStage('validated');
    }, 2500);

    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <div className="space-y-5">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Upload CVs
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Upload candidate resumes and match them
          against a selected job posting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          {/* =========================
              STAGE 1:
              FILE SELECTION
          ========================== */}
          {stage === 'select' && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Upload Candidate CVs
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Choose a job posting, then add one
                  or more PDF resumes for AI screening.
                </p>
              </div>

              {/* Job Selector */}
              <div className="mt-6">
                <label
                  htmlFor="jobPosting"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Select Job Posting
                </label>

                <select
                  id="jobPosting"
                  value={selectedJob}
                  onChange={(event) =>
                    setSelectedJob(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Choose a job posting
                  </option>

                  <option value="software-engineer">
                    Software Engineer
                  </option>

                  <option value="data-analyst">
                    Data Analyst
                  </option>

                  <option value="ui-ux-designer">
                    UI/UX Designer
                  </option>

                  <option value="qa-engineer">
                    QA Engineer
                  </option>
                </select>

                <p className="mt-2 text-xs text-slate-400">
                  Uploaded CVs will be evaluated
                  against the selected job description.
                </p>
              </div>

              {/* Initial Drag & Drop */}
              {selectedFiles.length === 0 && (
                <div className="mt-6">
                  <DropZone
                    onFilesSelected={
                      handleFilesSelected
                    }
                  />
                </div>
              )}

              {/* Files Selected */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <FileSelector
                    files={selectedFiles}
                    onRemoveFile={
                      handleRemoveFile
                    }
                    onAddFiles={
                      handleFilesSelected
                    }
                  />
                </div>
              )}

              {/* File Summary */}
              {selectedFiles.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="rounded-lg bg-slate-50 px-4 py-2">
                    <span className="text-xs text-slate-500">
                      Total CVs
                    </span>

                    <p className="text-sm font-bold text-slate-800">
                      {selectedFiles.length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-green-50 px-4 py-2">
                    <span className="text-xs text-green-600">
                      Valid
                    </span>

                    <p className="text-sm font-bold text-green-700">
                      {validFiles.length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-red-50 px-4 py-2">
                    <span className="text-xs text-red-500">
                      Invalid
                    </span>

                    <p className="text-sm font-bold text-red-600">
                      {invalidFiles.length}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedFiles([])
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                {selectedFiles.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={
                      !selectedJob ||
                      validFiles.length === 0 ||
                      invalidFiles.length > 0
                    }
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    Upload{' '}
                    {selectedFiles.length}{' '}
                    {selectedFiles.length === 1
                      ? 'CV'
                      : 'CVs'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-400"
                  >
                    Continue to Upload
                  </button>
                )}
              </div>
            </>
          )}

          {/* =========================
              STAGE 2:
              UPLOAD PROGRESS
          ========================== */}
          {stage === 'uploading' && (
            <>
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Uploading CVs
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Your CV files are being
                    uploaded and prepared for
                    validation.
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 px-3 py-2">
                  <p className="text-xs text-slate-500">
                    Job Posting
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-blue-700">
                    {getJobName(selectedJob)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <UploadProgress
                  files={selectedFiles}
                />
              </div>
            </>
          )}

          {/* =========================
              STAGE 3:
              VALIDATION COMPLETE
          ========================== */}
          {stage === 'validated' && (
            <>
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    CV Validation
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Review validation results
                    before starting AI screening.
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 px-3 py-2">
                  <p className="text-xs text-slate-500">
                    Job Posting
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-green-700">
                    {getJobName(selectedJob)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <FileValidationMessage
                  totalFiles={
                    selectedFiles.length
                  }
                  validFiles={
                    validFiles.length
                  }
                  invalidFiles={
                    invalidFiles.length
                  }
                />
              </div>

              {/* Validation Actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={handleBackToFiles}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Back to Files
                </button>

                <button
                  type="button"
                  onClick={
                    handleStartScreening
                  }
                  disabled={
                    invalidFiles.length > 0 ||
                    validFiles.length === 0
                  }
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  Start AI Screening
                </button>
              </div>
            </>
          )}
        </section>

        {/* =========================
            RIGHT SIDE INFORMATION
        ========================== */}
        <aside className="space-y-4">

          {/* Before Upload */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Info size={18} />
              </div>

              <h2 className="text-sm font-semibold text-slate-800">
                Before you upload
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <InfoItem>
                Select the correct job posting
                so each CV can be compared with
                the relevant job description.
              </InfoItem>

              <InfoItem>
                Upload resumes in PDF format
                only.
              </InfoItem>

              <InfoItem>
                Keep each individual file within
                the 5 MB size limit.
              </InfoItem>

              <InfoItem>
                You can select multiple
                candidate CVs for bulk
                screening.
              </InfoItem>
            </div>
          </section>

          {/* Screening Workflow */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ListChecks size={18} />
              </div>

              <h2 className="text-sm font-semibold text-slate-800">
                Screening workflow
              </h2>
            </div>

            <div className="mt-5 space-y-5">
              <WorkflowItem
                number="1"
                title="Choose job"
                description="Select the job description candidates should be matched against."
              />

              <WorkflowItem
                number="2"
                title="Add CVs"
                description="Drag and drop or browse for one or more PDF resumes."
              />

              <WorkflowItem
                number="3"
                title="Validate files"
                description="The system checks file format and file-size requirements."
              />

              <WorkflowItem
                number="4"
                title="Start AI screening"
                description="Valid CVs proceed to extraction, matching and recommendation."
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

const getJobName = (jobValue) => {
  const jobs = {
    'software-engineer':
      'Software Engineer',
    'data-analyst':
      'Data Analyst',
    'ui-ux-designer':
      'UI/UX Designer',
    'qa-engineer':
      'QA Engineer',
  };

  return jobs[jobValue] || 'Not selected';
};

const InfoItem = ({ children }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
        <CircleCheckBig size={12} />
      </div>

      <p className="text-xs leading-5 text-slate-500">
        {children}
      </p>
    </div>
  );
};

const WorkflowItem = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
        {number}
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-4 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CvUploadPage;