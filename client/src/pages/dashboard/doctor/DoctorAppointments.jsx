import { useDoctorAppointments, useUpdateDoctorAppointment } from "../../../hooks/useDoctors";
import { AppointmentCard } from "../../../components/doctor/DoctorCard";
import { Spinner, ErrorState, EmptyState } from "../../../components/ui/ui";

export default function DoctorAppointments() {
  const { data: list, isLoading, isError, refetch } = useDoctorAppointments();
  const update = useUpdateDoctorAppointment();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load appointments." onRetry={() => refetch()} />;
  if (!list || list.length === 0) {
    return <EmptyState icon="📅" title="No appointments yet" hint="When patients book you, requests appear here." />;
  }

  return (
    <div>
      <h1 className="text-xl font-extrabold">Appointments ({list.length})</h1>
      <div className="mt-4 space-y-3">
        {list.map((a) => (
          <AppointmentCard
            key={a._id}
            appointment={a}
            updating={update.isPending}
            onStatus={(aid, status) => update.mutate({ aid, payload: { status } })}
          />
        ))}
      </div>
    </div>
  );
}
