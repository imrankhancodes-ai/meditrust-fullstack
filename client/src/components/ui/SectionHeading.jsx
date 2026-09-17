// Consistent section rhythm: eyebrow + display headline + optional subtext.
export default function SectionHeading({ eyebrow, title, sub, align = "left", dark = false, className = "" }) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignCls} ${className}`}>
      {eyebrow && (
        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-teal-300" : "text-teal-600"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display mt-1 text-2xl font-bold leading-tight sm:text-3xl ${dark ? "text-white" : "text-slate-900"}`}>
        {title}
      </h2>
      {sub && <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-500"}`}>{sub}</p>}
    </div>
  );
}
