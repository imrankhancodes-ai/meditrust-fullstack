import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FlaskConical, MapPin, Clock } from "lucide-react";
import { usePathologists, usePathologyTests } from "../../hooks/useDoctors";
import { TestCard, TestBookingModal } from "../../components/pathologist/LabCard";
import { ErrorState, EmptyState, Badge } from "../../components/ui/ui";
import BrandLoader from "../../components/ui/BrandLoader";
import { ListSkeletonShaped } from "../../components/ui/Skeletons";
import Reveal from "../../components/motion/Reveal";

export default function LabProfile() {
  const { pid } = useParams();
  const { data: labs, isLoading: labsLoading } = usePathologists();
  const { data: tests, isLoading: testsLoading, isError, refetch } = usePathologyTests(pid);
  const [selected, setSelected] = useState(null);

  if (labsLoading || testsLoading) return <BrandLoader label="Loading lab…" />;
  if (isError) return <ErrorState message="Could not load lab." onRetry={() => refetch()} />;

  const lab = (labs || []).find((l) => l._id === pid);
  if (!lab) return <ErrorState message="Lab not found." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/labs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-800">
        <ArrowLeft size={15} strokeWidth={2.4} /> All labs
      </Link>
      <Reveal className="mt-3 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_2px_16px_rgba(15,118,110,0.08)] sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)]">
            <FlaskConical size={30} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">{lab.laboratoryName}</h1>
            <p className="flex items-center gap-1 text-slate-500"><MapPin size={14} strokeWidth={2.2} />{lab.laboratoryAddress}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {(lab.specialization || []).map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
          <Clock size={14} strokeWidth={2.2} className="text-slate-400" />
          {(lab.availableDays || []).join(", ")} · {lab.workingHours?.start}–{lab.workingHours?.end}
        </p>
      </Reveal>

      <h2 className="font-display mt-6 font-bold text-slate-900">Available tests</h2>
      <div className="mt-2 space-y-3">
        {(!tests || tests.length === 0) && !(labsLoading || testsLoading) && (
          <EmptyState icon={<FlaskConical size={30} strokeWidth={2} />} title="No tests listed" hint="This lab hasn't added tests yet." />
        )}
        {(tests || []).map((t) => (
          <TestCard key={t._id} test={t} onBook={setSelected} />
        ))}
      </div>

      <TestBookingModal open={!!selected} onClose={() => setSelected(null)} labId={pid} test={selected || {}} />
    </div>
  );
}
