import { Link } from "react-router-dom";
import { FileText, Store, Stethoscope, FlaskConical, MessageCircle, ArrowRight } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/product/ProductCard";
import { Skeletons, ErrorState } from "../components/ui/ui";

export default function Home() {
  const { data: products, isLoading, isError, refetch } = useProducts({});

  const steps = [
    { icon: FileText, title: "Upload prescription", text: "Snap a photo — AI reads medicines, dosage & duration in seconds." },
    { icon: Store, title: "Order what's available", text: "See live stock, prices and alternative brands for the same composition." },
    { icon: Stethoscope, title: "Book what's needed", text: "Consult verified doctors or book lab tests when the prescription needs follow-up." },
    { icon: MessageCircle, title: "Ask what's unclear", text: "Chat for general guidance — always nudged toward a real doctor for specifics." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-sky-700 px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-200">AI-powered healthcare</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-5xl">
            Upload a prescription → get it explained → order what&apos;s available.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-teal-50">
            MediTrust reads your prescription with AI, checks live medicine availability with
            alternative brands, and connects you to doctors and labs — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/prescriptions/upload"
              className="btn-press inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50"
            >
              <FileText size={16} /> Upload prescription <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop"
              className="btn-press inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              <Store size={16} /> Browse medicines
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <s.icon size={20} />
            </div>
            <div className="mt-3 text-xs font-bold uppercase text-teal-600">Step {i + 1}</div>
            <h3 className="font-bold text-slate-900">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.text}</p>
          </div>
        ))}
      </section>

      {/* Quick links */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { to: "/doctors", icon: Stethoscope, title: "Find a doctor", text: "Browse by specialization & book instantly" },
          { to: "/labs", icon: FlaskConical, title: "Book lab tests", text: "Diagnostic labs & pathology tests near you" },
          { to: "/chat", icon: MessageCircle, title: "Health chat", text: "General guidance, polling-based & AI-assisted" },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)] transition hover:shadow-[0_8px_30px_rgba(15,118,110,0.15)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-white">
              <c.icon size={22} />
            </span>
            <span>
              <span className="block font-bold text-slate-900 group-hover:text-teal-800">{c.title}</span>
              <span className="block text-sm text-slate-500">{c.text}</span>
            </span>
          </Link>
        ))}
      </section>

      {/* Featured products */}
      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">Featured medicines</h2>
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-800">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <Skeletons count={4} />
        ) : isError ? (
          <ErrorState message="Could not load products." onRetry={() => refetch()} />
        ) : !products || products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
            No products yet — check back soon.
          </div>
        ) : (
          <ProductGrid products={products.slice(0, 8)} />
        )}
      </section>
    </div>
  );
}
