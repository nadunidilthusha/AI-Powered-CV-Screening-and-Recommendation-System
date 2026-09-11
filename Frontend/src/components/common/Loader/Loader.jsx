import { Loader2 } from 'lucide-react';

/** Spinner used for page/section loading states. Pass fullPage for a centered block. */
const Loader = ({ label = 'Loading...', fullPage = false, size = 22 }) => {
  const content = (
    <div className="flex flex-col items-center gap-3 text-slate-400">
      <Loader2 size={size} className="animate-spin text-blue-600" />
      {label && <p className="text-xs font-medium">{label}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="flex min-h-[320px] items-center justify-center">{content}</div>;
  }
  return content;
};

export default Loader;
