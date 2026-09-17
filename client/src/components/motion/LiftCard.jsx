import { motion } from "framer-motion";

// Hover lift + tap press for cards. Disabled transforms under reduced motion via CSS? No —
// framer respects nothing automatically, so keep amplitudes tiny (safe even when animated).
export function LiftCard({ children, className = "", lift = -4 }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: lift }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {children}
    </motion.div>
  );
}
