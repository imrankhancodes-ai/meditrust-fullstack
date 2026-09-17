import { HeartPulse } from "lucide-react";

// Branded loading mark: heartbeat icon inside a pulsing ring.
export default function BrandLoader({ size = 44, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="relative flex items-center justify-center" style={{ width: size + 24, height: size + 24 }}>
        <span className="animate-ping-ring absolute inset-0 rounded-full border-2 border-teal-500" />
        <span className="animate-heartbeat flex items-center justify-center rounded-full bg-teal-700 text-white" style={{ width: size, height: size }}>
          <HeartPulse size={size * 0.5} strokeWidth={2.2} />
        </span>
      </div>
      {label && <p className="text-sm font-semibold text-slate-500">{label}</p>}
    </div>
  );
}

// Tiny inline variant for buttons.
export function BrandLoaderInline({ size = 16 }) {
  return (
    <span className="animate-heartbeat inline-flex items-center justify-center rounded-full bg-white/25">
      <HeartPulse size={size} strokeWidth={2.4} />
    </span>
  );
}
