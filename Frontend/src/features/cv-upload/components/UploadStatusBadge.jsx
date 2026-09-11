import {
  Clock3,
  LoaderCircle,
  CircleCheckBig,
  CircleX,
} from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending',
    classes: 'bg-slate-100 text-slate-600',
    Icon: Clock3,
  },

  processing: {
    label: 'Processing',
    classes: 'bg-blue-100 text-blue-700',
    Icon: LoaderCircle,
  },

  complete: {
    label: 'Complete',
    classes: 'bg-green-100 text-green-700',
    Icon: CircleCheckBig,
  },

  failed: {
    label: 'Failed',
    classes: 'bg-red-100 text-red-600',
    Icon: CircleX,
  },
};

const UploadStatusBadge = ({ status = 'pending' }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}
    >
      <Icon
        size={14}
        className={
          status === 'processing'
            ? 'animate-spin'
            : ''
        }
      />

      {config.label}
    </span>
  );
};

export default UploadStatusBadge;