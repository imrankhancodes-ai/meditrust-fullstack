import { useState } from "react";
import { useDoctors } from "../../hooks/useDoctors";
import { DoctorCard } from "../../components/doctor/DoctorCard";
import { Skeletons, ErrorState, EmptyState } from "../../components/ui/ui";

export default function DoctorList() {
  const { data: doctors, isLoading, isError, refetch } = useDoctors();
  const [spec, setSpec] = useState("");

  const specs = [...new Set((doctors || []).flatMap((d) => d.specialization || []))];
  const filtered = spec ? (doctors || []).filter((d) => (d.specialization || []).includes(spec)) : doctors || [];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Find a doctor</h1>
      <p className="mt-1 text-sm text-slate-500">Verified practitioners — book in one click.</p>

      {specs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSpec("")}
            className={`btn-press rounded-full px-4 py-1.5 text-sm font-semibold ${!spec ? "bg-teal-700 text-white" : "bg-white text-slate-600 shadow-sm"}`}
          >
            All
          </button>
          {specs.map((s) => (
            <button
              key={s}
              onClick={() => setSpec(spec === s ? "" : s)}
              className={`btn-press rounded-full px-4 py-1.5 text-sm font-semibold ${spec === s ? "bg-teal-700 text-white" : "bg-white text-slate-600 shadow-sm"}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5">
        {isLoading ? (
          <Skeletons count={6} />
        ) : isError ? (
          <ErrorState message="Could not load doctors." onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState icon="🩺" title="No doctors found" hint="Try clearing the specialization filter." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DoctorCard key={d._id} doctor={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
