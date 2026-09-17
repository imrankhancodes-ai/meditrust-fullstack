import { motion } from "framer-motion";
import { useMotionPrefs } from "./useMotionPrefs";

// Staggered children reveal for grids and lists.
export function StaggerGroup({ children, className = "", stagger = 0.06 }) {
  const { reduce } = useMotionPrefs();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", y = 18 }) {
  const { duration, reduce } = useMotionPrefs();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: duration(400), ease: "easeOut" } },
      }}
    >
      {children}
    </motion.div>
  );
}
