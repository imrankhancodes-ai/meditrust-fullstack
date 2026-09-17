// Decorative blurred gradient mesh behind heroes and dashboard headers.
// Pure CSS, pointer-events-none, disabled motion is N/A (static).
export default function GradientMesh({ variant = "light", className = "" }) {
  if (variant === "dark") {
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="absolute -bottom-32 right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-glow-500/25 blur-3xl" />
        <div className="absolute left-1/3 top-1/3 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
      </div>
    );
  }
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />
      <div className="absolute -bottom-28 right-[-4rem] h-96 w-96 rounded-full bg-glow-500/20 blur-3xl" />
      <div className="absolute left-1/2 top-0 h-56 w-56 rounded-full bg-teal-100/60 blur-3xl" />
    </div>
  );
}
