
// Glass panel card for use over gradient meshes / dark heroes.
export default function GlassCard({ children, className = "", dark = false }) {
  return (
    <div
      className={`rounded-3xl backdrop-blur-xl ${
        dark
          ? "border border-white/15 bg-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
          : "border border-white/60 bg-white/70 shadow-[0_8px_30px_rgba(15,118,110,0.12)]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
