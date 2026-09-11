import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

const VARIANTS = {
  success: { wrap: 'bg-green-50 border-green-200 text-green-700', Icon: CheckCircle2 },
  warning: { wrap: 'bg-amber-50 border-amber-200 text-amber-700', Icon: AlertTriangle },
  error: { wrap: 'bg-red-50 border-red-200 text-red-700', Icon: XCircle },
  info: { wrap: 'bg-blue-50 border-blue-200 text-blue-700', Icon: Info },
};

/** Inline banner for success / warning / error / info messages. */
const Alert = ({ variant = 'info', title, children }) => {
  const { wrap, Icon } = VARIANTS[variant] ?? VARIANTS.info;

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${wrap}`}>
      <Icon size={18} className="mt-0.5 flex-shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="mt-0.5 opacity-90">{children}</div>}
      </div>
    </div>
  );
};

export default Alert;
