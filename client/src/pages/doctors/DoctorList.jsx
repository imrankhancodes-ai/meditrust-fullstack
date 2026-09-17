import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { useDoctors } from "../../hooks/useDoctors";
import { DoctorGrid } from "../../components/doctor/DoctorCard";
import { ErrorState, EmptyState } from "../../components/ui/ui";
import { CardGridSkeleton } from "../../components/ui/Skeletons";
import SectionHeading from "../../components/ui/SectionHeading";
import GradientMesh from "../../components/ui/GradientMesh";

export default function DoctorList() {
  const { data: doctors, isLoading, isError, refetch } = useDoctors();
  const [spec, setSpec] = useState("");

  const specs = [...new Set((doctors || []).flatMap((d) => d.specialization || []))];
  const filtered = spec ? (doctors || []).filter((d) => (d.specialization || []).includes(spec)) : doctors || [];

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white px-6 py-8 shadow-[0_2px_16px_rgba(15,118,110,0.08)] sm:px-8">
        <GradientMesh />
        <div className="relative">
          <SectionHeading
            eyebrow="Care"
            title="Find a doctor"
            sub="Verified practitioners — book in one click."
          />
          {specs.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSpec("")}
                className={`btn-press rounded-full px-4 py-2 text-sm font-semibold transition ${!spec ? "bg-sky-600 text-white shadow-[0_4px_14px_rgba(2,132,199,0.35)]" : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-sky-50"}`}
              >
                All
              </button>
              {specs.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpec(spec === s ? "" : s)}
                  className={`btn-press rounded-full px-4 py-2 text-sm font-semibold transition ${spec === s ? "bg-sky-600 text-white shadow-[0_4px_14px_rgba(2,132,199,0.35)]" : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-sky-50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mt-5">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : isError ? (
          <ErrorState message="Could not load doctors." onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Stethoscope size={30} strokeWidth={2} />} title="No doctors found" hint="Try clearing the specialization filter." />
        ) : (
          <DoctorGrid doctors={filtered} />
        )}
      </div>
    </div>
  );
}
