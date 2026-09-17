import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePathologists, usePathologyTests } from "../../hooks/useDoctors";
import { TestCard, TestBookingModal } from "../../components/pathologist/LabCard";
import { Spinner, ErrorState, EmptyState, Badge } from "../../components/ui/ui";

export default function LabProfile() {
  const { pid } = useParams();
  const { data: labs, isLoading: labsLoading } = usePathologists();
  const { data: tests, isLoading: testsLoading, isError, refetch } = usePathologyTests(pid);
  const [selected, setSelected] = useState(null);

  if (labsLoading || testsLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load lab." onRetry={() => refetch()} />;

  const lab = (labs || []).find((l) => l._id === pid);
  if (!lab) return <ErrorState message="Lab not found." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/labs" className="text-sm font-semibold text-teal-700">← All labs</Link>
      <div className="mt-3 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
        <h1 className="text-2xl font-extrabold text-slate-900">{lab.laboratoryName}</h1>
        <p className="text-slate-500">{lab.laboratoryAddress}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {(lab.specialization || []).map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-600">
          🕒 {(lab.availableDays || []).join(", ")} · {lab.workingHours?.start}–{lab.workingHours?.end}
        </p>
      </div>

      <h2 className="mt-6 font-extrabold text-slate-900">Available tests</h2>
      <div className="mt-2 space-y-3">
        {(!tests || tests.length === 0) && (
          <EmptyState icon="🧪" title="No tests listed" hint="This lab hasn't added tests yet." />
        )}
        {(tests || []).map((t) => (
          <TestCard key={t._id} test={t} onBook={setSelected} />
        ))}
      </div>

      <TestBookingModal open={!!selected} onClose={() => setSelected(null)} labId={pid} test={selected || {}} />
    </div>
  );
}
