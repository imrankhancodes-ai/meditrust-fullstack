import { usePathologistAppointments, useUpdatePathologistAppointment } from "../../../hooks/useDoctors";
import { AppointmentCard } from "../../../components/doctor/DoctorCard";
import { ErrorState, EmptyState } from "../../../components/ui/ui";
import { ListSkeletonShaped } from "../../../components/ui/Skeletons";
import { FlaskConical } from "lucide-react";

export default function PathologistAppointments() {
  const { data: list, isLoading, isError, refetch } = usePathologistAppointments();
  const update = useUpdatePathologistAppointment();

  if (isLoading) return <ListSkeletonShaped count={4} />;
  if (isError) return <ErrorState message="Could not load bookings." onRetry={() => refetch()} />;
  if (!list || list.length === 0) {
    return <EmptyState icon={<FlaskConical size={30} strokeWidth={2} />} title="No test bookings yet" hint="When patients book a test, requests appear here." />;
  }

  return (
    <div>
      <h1 className="font-display text-xl font-bold">Test bookings ({list.length})</h1>
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
