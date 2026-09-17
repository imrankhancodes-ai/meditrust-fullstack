import { Link } from "react-router-dom";
import { FileText, Plus, CalendarClock } from "lucide-react";
import { useMyPrescriptions } from "../../hooks/usePrescriptions";
import { ErrorState, EmptyState } from "../../components/ui/ui";
import { OrderListSkeleton } from "../../components/ui/Skeletons";
import SectionHeading from "../../components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "../../components/motion/Stagger";

export default function MyPrescriptions() {
  const { data: list, isLoading, isError, refetch } = useMyPrescriptions();

  if (isLoading) return <OrderListSkeleton count={4} />;
  if (isError) return <ErrorState message="Could not load prescriptions." onRetry={() => refetch()} />;
  if (!list || list.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={30} strokeWidth={2} />}
        title="No prescriptions yet"
        hint="Upload your first prescription photo and let AI do the reading."
        action={
          <Link to="/prescriptions/upload" className="btn-press rounded-full bg-teal-700 px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)]">
            Upload prescription
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <SectionHeading eyebrow="History" title="My prescriptions" />
        <Link to="/prescriptions/upload" className="btn-press inline-flex shrink-0 items-center gap-1.5 rounded-full bg-teal-700 px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)]">
          <Plus size={15} strokeWidth={2.6} /> New upload
        </Link>
      </div>
      <StaggerGroup className="mt-4 space-y-3">
        {list.map((p) => (
          <StaggerItem key={p._id}>
            <Link to={`/prescriptions/${p._id}`} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <FileText size={20} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-slate-900">
                  {p.patient_name || "Prescription"} · {p.medicines?.length || 0} medicine(s)
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">
                  {p.doctor_name ? `Dr. ${p.doctor_name}` : "Unknown doctor"} · {p.date || "no date"}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                <CalendarClock size={13} strokeWidth={2.2} />
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
