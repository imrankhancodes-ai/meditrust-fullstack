import { useState } from "react";
import { usePathologists, usePathologyTests } from "../../hooks/useDoctors";
import { LabCard } from "../../components/pathologist/LabCard";
import { Skeletons, ErrorState, EmptyState } from "../../components/ui/ui";

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
      <h1 className="text-2xl font-extrabold text-slate-900">Diagnostic labs</h1>
      <p className="mt-1 text-sm text-slate-500">Browse labs and book pathology tests.</p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search labs, areas, specializations…"
        className="mt-4 w-full max-w-md rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
      />
      <div className="mt-5">
        {isLoading ? (
          <Skeletons count={6} />
        ) : isError ? (
          <ErrorState message="Could not load labs." onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState icon="🧪" title="No labs found" hint="Try a different search." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <LabCard key={l._id} lab={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function useLabTests(labId) {
  return usePathologyTests(labId);
}
