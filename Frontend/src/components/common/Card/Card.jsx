/**
 * Generic panel used for every boxed section across the app
 * (job list table wrapper, form panels, settings sections, stat groups).
 */
const Card = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  bodyClassName = 'p-5',
  noPadding = false,
}) => {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-bold text-slate-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={noPadding ? '' : bodyClassName}>{children}</div>
    </div>
  );
};

export default Card;
