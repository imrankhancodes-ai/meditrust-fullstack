import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ACCENT = {
  teal: { icon: "bg-teal-50 text-teal-700", bar: "bg-teal-600" },
  sky: { icon: "bg-sky-50 text-sky-700", bar: "bg-sky-600" },
  violet: { icon: "bg-violet-50 text-violet-700", bar: "bg-violet-600" },
  ink: { icon: "bg-slate-900 text-white", bar: "bg-ink-950" },
  amber: { icon: "bg-amber-50 text-amber-700", bar: "bg-amber-500" },
  emerald: { icon: "bg-emerald-50 text-emerald-700", bar: "bg-emerald-600" },
};

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const end = Number(target) || 0;
    if (reduced.current) {
      setValue(end);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// Big animated number + label + optional trend. Reused across all dashboards.
export default function StatCard({ icon: Icon, label, value, sub, trend, accent = "teal", prefix = "", suffix = "" }) {
  const animated = useCountUp(value);
  const a = ACCENT[accent] || ACCENT.teal;
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
      <div className={`absolute inset-x-0 top-0 h-1 ${a.bar}`} />
      <div className="flex items-start justify-between gap-2">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${a.icon}`}>
          {Icon ? <Icon size={22} strokeWidth={2.2} /> : null}
        </div>
        {trend && trend !== "flat" && (
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
            <TrendIcon size={14} />
          </span>
        )}
      </div>
      <div className="font-display mt-3 text-3xl font-bold tabular-nums text-slate-900">
        {prefix}{typeof value === "number" ? animated.toLocaleString("en-IN") : value}{suffix}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-slate-500">{label}</div>
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </div>
  );
}
