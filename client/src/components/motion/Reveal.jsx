import { motion } from "framer-motion";
import { useMotionPrefs } from "./useMotionPrefs";

// whileInView fade/slide-up for section content on scroll.
export default function Reveal({ children, delay = 0, y = 20, className = "" }) {
  const { duration, reduce } = useMotionPrefs();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: duration(450), delay: duration(delay * 1000), ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
