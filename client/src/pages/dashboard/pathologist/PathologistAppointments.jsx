import { usePathologistAppointments, useUpdatePathologistAppointment } from "../../../hooks/useDoctors";
import { AppointmentCard } from "../../../components/doctor/DoctorCard";
import { Spinner, ErrorState, EmptyState } from "../../../components/ui/ui";

export default function PathologistAppointments() {
  const { data: list, isLoading, isError, refetch } = usePathologistAppointments();
  const update = useUpdatePathologistAppointment();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load bookings." onRetry={() => refetch()} />;
  if (!list || list.length === 0) {
    return <EmptyState icon="🧪" title="No test bookings yet" hint="When patients book a test, requests appear here." />;
  }

  return (
    <div>
      <h1 className="text-xl font-extrabold">Test bookings ({list.length})</h1>
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
