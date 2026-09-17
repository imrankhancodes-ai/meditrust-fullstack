import { motion } from "framer-motion";
import { useMotionPrefs } from "./useMotionPrefs";

// Wraps route content: fade + slight upward slide on mount (~220ms, ease-out).
export default function PageTransition({ children, routeKey }) {
  const { duration } = useMotionPrefs();
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: duration(220), ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
