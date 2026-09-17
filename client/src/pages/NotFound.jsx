import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowRight, House } from "lucide-react";
import GradientMesh from "../components/ui/GradientMesh";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white px-6 py-14 shadow-[0_2px_16px_rgba(15,118,110,0.08)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <GradientMesh />
        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-700">
            <Compass size={30} strokeWidth={2} />
          </div>
          <div className="font-display mt-3 text-6xl font-bold text-slate-200">404</div>
          <h1 className="font-display mt-1 text-2xl font-bold text-slate-900">Lost your way?</h1>
          <p className="mt-1 text-sm text-slate-500">This page doesn&apos;t exist or moved.</p>
          <Link to="/" className="btn-press mt-5 inline-flex items-center gap-1.5 rounded-full bg-teal-700 px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)]">
            <House size={15} strokeWidth={2.2} /> Go home <ArrowRight size={14} strokeWidth={2.4} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
