import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Store,
  Stethoscope,
  FlaskConical,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  ShoppingBag,
  ClipboardList,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/product/ProductCard";
import { ErrorState } from "../components/ui/ui";
import { ProductGridSkeleton } from "../components/ui/Skeletons";
import GradientMesh from "../components/ui/GradientMesh";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "../components/motion/Stagger";
import { useMotionPrefs } from "../components/motion/useMotionPrefs";

export default function Home() {
  const { data: products, isLoading, isError, refetch } = useProducts({});
  const { reduce } = useMotionPrefs();

  const steps = [
    { icon: FileText, title: "Upload prescription", text: "Snap a photo — AI reads medicines, dosage & duration in seconds." },
    { icon: Store, title: "Order what's available", text: "See live stock, prices and alternative brands for the same composition." },
    { icon: Stethoscope, title: "Book what's needed", text: "Consult verified doctors or book lab tests when the prescription needs follow-up." },
    { icon: MessageCircle, title: "Ask what's unclear", text: "Chat for general guidance — always nudged toward a real doctor for specifics." },
  ];

  return (
    <div>
      {/* ===== Dark hero band ===== */}
      <section className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-6 py-12 text-white sm:px-12 sm:py-16">
        <GradientMesh variant="dark" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <p className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-200">
                <Zap size={12} strokeWidth={2.4} /> AI-powered healthcare
              </p>
            </motion.div>
            <motion.h1
              className="font-display mt-4 text-4xl font-bold leading-[1.05] sm:text-6xl"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            >
              Upload a prescription.
              <br />
              <span className="bg-gradient-to-r from-teal-300 via-teal-200 to-glow-500 bg-clip-text text-transparent">
                Get it explained.
              </span>
              <br />
              Order what&apos;s available.
            </motion.h1>
            <motion.p
              className="mt-4 max-w-xl leading-relaxed text-slate-300"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            >
              MediTrust reads your prescription with AI, checks live medicine availability with
              alternative brands, and connects you to doctors and labs — all in one place.
            </motion.p>
            <motion.div
              className="mt-7 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
            >
              <Link
                to="/prescriptions/upload"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-900 shadow-[0_8px_30px_rgba(45,212,191,0.35)] hover:bg-teal-50"
              >
                <FileText size={16} strokeWidth={2.2} /> Upload prescription <ArrowRight size={16} strokeWidth={2.2} />
              </Link>
              <Link
                to="/shop"
                className="btn-press inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/15"
              >
                <Store size={16} strokeWidth={2.2} /> Browse medicines
              </Link>
            </motion.div>
            {/* avatar-stack social proof */}
            <motion.div
              className="mt-7 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.34 }}
            >
              <div className="flex -space-x-2.5">
                {["RS", "PV", "AJ", "SP"].map((n, i) => (
                  <span
                    key={n}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-extrabold text-white ring-2 ring-ink-950 ${
                      ["bg-teal-600", "bg-sky-600", "bg-violet-600", "bg-emerald-600"][i]
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-0.5 text-slate-300">Trusted by patients across Indore</p>
              </div>
            </motion.div>
          </div>

          {/* floating live-stat widgets */}
          <div className="relative hidden flex-col gap-4 lg:flex">
            <GlassCard dark className={`p-5 ${reduce ? "" : "animate-floaty"}`}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-200">
                  <ClipboardList size={22} strokeWidth={2.2} />
                </span>
                <div>
                  <div className="font-display text-2xl font-bold">3 free</div>
                  <div className="text-xs text-slate-300">AI prescription parses per account</div>
                </div>
              </div>
            </GlassCard>
            <GlassCard dark className={`ml-8 p-5 ${reduce ? "" : "animate-floaty-slow"}`}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-glow-500/20 text-sky-200">
                  <ShoppingBag size={22} strokeWidth={2.2} />
                </span>
                <div>
                  <div className="font-display text-2xl font-bold">Live stock</div>
                  <div className="text-xs text-slate-300">Prices + alternative brands, checked instantly</div>
                </div>
              </div>
            </GlassCard>
            <GlassCard dark className={`p-5 ${reduce ? "" : "animate-floaty"}`}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-200">
                  <ShieldCheck size={22} strokeWidth={2.2} />
                </span>
                <div>
                  <div className="font-display text-2xl font-bold">Verified care</div>
                  <div className="text-xs text-slate-300">Doctors & labs reviewed by our team</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ===== Trust strip ===== */}
      <Reveal className="mt-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Store} label="Medicines in stock" value={products?.length ?? 0} accent="teal" sub="Live catalog" />
          <StatCard icon={Stethoscope} label="Verified doctors" value={10} accent="sky" sub="Across 10 specialties" />
          <StatCard icon={FlaskConical} label="Diagnostic labs" value={5} accent="violet" sub="16+ tests bookable" />
          <StatCard icon={Zap} label="AI parse time" value={30} suffix="s" accent="amber" sub="Average extraction" />
        </div>
      </Reveal>

      {/* ===== Steps ===== */}
      <section className="mt-12">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From photo to pharmacy in four steps"
            sub="One flow covers prescriptions, ordering, appointments and follow-up questions."
          />
        </Reveal>
        <StaggerGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <StaggerItem key={s.title}>
              <div className="h-full rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <s.icon size={21} strokeWidth={2.2} />
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-widest text-teal-600">Step {i + 1}</div>
                <h3 className="font-display font-bold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ===== Quick links ===== */}
      <StaggerGroup className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { to: "/doctors", icon: Stethoscope, title: "Find a doctor", text: "Browse by specialization & book instantly" },
          { to: "/labs", icon: FlaskConical, title: "Book lab tests", text: "Diagnostic labs & pathology tests near you" },
          { to: "/chat", icon: MessageCircle, title: "Health chat", text: "General guidance, AI-assisted" },
        ].map((c) => (
          <StaggerItem key={c.to}>
            <Link
              to={c.to}
              className="group flex h-full items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)] transition hover:shadow-[0_8px_30px_rgba(15,118,110,0.15)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)]">
                <c.icon size={22} strokeWidth={2.2} />
              </span>
              <span>
                <span className="font-display block font-bold text-slate-900 group-hover:text-teal-800">{c.title}</span>
                <span className="block text-sm text-slate-500">{c.text}</span>
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* ===== Featured products ===== */}
      <section className="mt-12">
        <Reveal>
          <div className="mb-4 flex items-center justify-between">
            <SectionHeading eyebrow="Pharmacy" title="Featured medicines" />
            <Link to="/shop" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-800">
              View all <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </Reveal>
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : isError ? (
          <ErrorState message="Could not load products." onRetry={() => refetch()} />
        ) : !products || products.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-sm text-slate-500">
            No products yet — check back soon.
          </div>
        ) : (
          <Reveal>
            <ProductGrid products={products.slice(0, 8)} />
          </Reveal>
        )}
      </section>
    </div>
  );
}
