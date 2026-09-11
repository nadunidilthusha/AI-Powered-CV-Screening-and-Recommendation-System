/**
 * Shared form field. Handles text/number/email/password inputs, a textarea
 * variant, and a select variant, so every form in the app (job form,
 * account settings, auth forms) can share one styled field.
 *
 * Usage:
 *   <Input label="Job title" value={v} onChange={...} />
 *   <Input as="textarea" label="Description" ... />
 *   <Input as="select" label="Department" value={v} onChange={...}>
 *     <option>Engineering</option>
 *   </Input>
 */
const Input = ({
  label,
  hint,
  error,
  as = 'input',
  type = 'text',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = `w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
    error ? 'border-red-300' : 'border-slate-200'
  }`;

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold text-slate-800">
          {label}
          {hint && <span className="ml-1.5 font-normal text-slate-400">{hint}</span>}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea className={`${baseClasses} min-h-[130px] resize-y leading-relaxed`} {...props} />
      ) : as === 'select' ? (
        <select className={baseClasses} {...props}>
          {children}
        </select>
      ) : (
        <input type={type} className={baseClasses} {...props} />
      )}

      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
