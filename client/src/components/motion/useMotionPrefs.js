import { useReducedMotion } from "framer-motion";

export function useMotionPrefs() {
  const reduce = useReducedMotion();
  return {
    reduce,
    // near-zero duration fade when the user prefers reduced motion
    duration: (ms) => (reduce ? 0.01 : ms / 1000),
  };
}
