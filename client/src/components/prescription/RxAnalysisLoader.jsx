import { useEffect, useState } from "react";
import { ScanLine, Pill, Store, Sparkles } from "lucide-react";

const DEFAULT_STEPS = [
  { label: "Reading your prescription…", icon: ScanLine },
  { label: "Extracting medicines & dosages…", icon: Pill },
  { label: "Matching against our pharmacy…", icon: Store },
  { label: "Finding trusted alternatives…", icon: Sparkles },
];

// Multi-step animated AI-work sequence. Self-advances on a believable
// staged timer while mounted; unmounts when the real request settles.
export default function RxAnalysisLoader({ steps = DEFAULT_STEPS, stepMs = 2200, compact = false }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
    const t = setInterval(() => {
      setActive((s) => (s < steps.length - 1 ? s + 1 : s));
    }, stepMs);
    return () => clearInterval(t);
  }, [steps.length, stepMs]);

  return (
    <div className={`rounded-3xl bg-white shadow-[0_2px_16px_rgba(15,118,110,0.08)] ${compact ? "p-4" : "p-6"}`}>
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <span className="animate-ping-ring absolute inset-0 rounded-full border-2 border-teal-500" />
          <span className="animate-heartbeat flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-white">
            <Pill size={18} strokeWidth={2.2} />
          </span>
        </div>
        <div>
          <p className="font-display font-bold text-slate-900">Analyzing with AI</p>
          <p className="text-xs text-slate-400">Working through your prescription step by step</p>
        </div>
      </div>
      <ol className="mt-4 space-y-2.5">
        {steps.map((s, i) => {
          const done = i < active;
          const current = i === active;
          const Icon = s.icon;
          return (
            <li key={s.label} className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                  done
                    ? "bg-emerald-600 text-white"
                    : current
                      ? "animate-step-pulse bg-teal-700 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path className="animate-draw-check" d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <Icon size={15} strokeWidth={2.2} />
                )}
              </span>
              <span
                className={`text-sm transition-colors ${
                  done ? "font-medium text-slate-400 line-through decoration-emerald-300" : current ? "font-bold text-slate-900" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-xs text-slate-400">This can take several seconds. Please don&apos;t close this page.</p>
    </div>
  );
}
