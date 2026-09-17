export function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "btn-press inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 focus:ring-teal-600",
    secondary: "bg-teal-50 text-teal-800 hover:bg-teal-100 focus:ring-teal-500",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-teal-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-300",
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)] ${className}`}>
      {children}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl nice-scroll">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Input({ label, error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>}
      <input
        className={`w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100 ${
          error ? "border-red-400" : "border-slate-300"
        }`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Spinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
    </div>
  );
}

const badgeColors = {
  high: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-orange-100 text-orange-800",
  none: "bg-slate-200 text-slate-700",
  placed: "bg-sky-100 text-sky-800",
  processing: "bg-amber-100 text-amber-800",
  shipped: "bg-violet-100 text-violet-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-700",
  default: "bg-slate-100 text-slate-700",
};

export function Badge({ tone = "default", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        badgeColors[tone] || badgeColors.default
      }`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, hint, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-14 text-center shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
      <div className="mb-3 text-4xl">{icon || "📦"}</div>
      <h3 className="text-base font-bold text-slate-900">{title || "Nothing here yet"}</h3>
      {hint && <p className="mt-1 max-w-sm text-sm text-slate-500">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center">
      <div className="mb-2 text-3xl">⚠️</div>
      <p className="text-sm font-medium text-slate-700">{message || "Something went wrong."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-press mt-3 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function Skeletons({ count = 6, className = "" }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="skeleton h-40 w-full" />
          <div className="skeleton mt-3 h-4 w-3/4" />
          <div className="skeleton mt-2 h-4 w-1/2" />
          <div className="skeleton mt-3 h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
