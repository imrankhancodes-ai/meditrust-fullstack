import { Link } from "react-router-dom";
import { useMyPrescriptions } from "../../hooks/usePrescriptions";
import { Spinner, ErrorState, EmptyState } from "../../components/ui/ui";

export default function MyPrescriptions() {
  const { data: list, isLoading, isError, refetch } = useMyPrescriptions();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load prescriptions." onRetry={() => refetch()} />;
  if (!list || list.length === 0) {
    return (
      <EmptyState
        icon="📄"
        title="No prescriptions yet"
        hint="Upload your first prescription photo and let AI do the reading."
        action={
          <Link to="/prescriptions/upload" className="btn-press rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">
            Upload prescription
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">My prescriptions</h1>
        <Link to="/prescriptions/upload" className="btn-press rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white">
          + New upload
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {list.map((p) => (
          <Link key={p._id} to={`/prescriptions/${p._id}`} className="block rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-900">
                {p.patient_name || "Prescription"} · {p.medicines?.length || 0} medicine(s)
              </span>
              <span className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleString()}</span>
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {p.doctor_name ? `Dr. ${p.doctor_name}` : "Unknown doctor"} · {p.date || "no date"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
