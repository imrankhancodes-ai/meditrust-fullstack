import { useState } from "react";
import { Search, FlaskConical } from "lucide-react";
import { usePathologists, usePathologyTests } from "../../hooks/useDoctors";
import { LabGrid } from "../../components/pathologist/LabCard";
import { ErrorState, EmptyState } from "../../components/ui/ui";
import { CardGridSkeleton, LabCardSkeleton } from "../../components/ui/Skeletons";
import SectionHeading from "../../components/ui/SectionHeading";
import GradientMesh from "../../components/ui/GradientMesh";

export default function LabList() {
  const { data: labs, isLoading, isError, refetch } = usePathologists();
  const [q, setQ] = useState("");

  const filtered = (labs || []).filter((l) =>
    !q
      ? true
      : (l.laboratoryName + " " + l.laboratoryAddress + " " + (l.specialization || []).join(" "))
          .toLowerCase()
          .includes(q.toLowerCase())
  );

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white px-6 py-8 shadow-[0_2px_16px_rgba(15,118,110,0.08)] sm:px-8">
        <GradientMesh />
        <div className="relative">
          <SectionHeading
            eyebrow="Diagnostics"
            title="Diagnostic labs"
            sub="Browse labs and book pathology tests."
          />
          <div className="relative mt-4 max-w-md">
            <Search size={17} strokeWidth={2.2} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search labs, areas, specializations…"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>
        </div>
      </section>
      <div className="mt-5">
        {isLoading ? (
          <CardGridSkeleton count={6} Card={LabCardSkeleton} />
        ) : isError ? (
          <ErrorState message="Could not load labs." onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<FlaskConical size={30} strokeWidth={2} />} title="No labs found" hint="Try a different search." />
        ) : (
          <LabGrid labs={filtered} />
        )}
      </div>
    </div>
  );
}

export function useLabTests(labId) {
  return usePathologyTests(labId);
}
