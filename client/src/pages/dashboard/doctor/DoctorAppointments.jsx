import { useDoctorAppointments, useUpdateDoctorAppointment } from "../../../hooks/useDoctors";
import { AppointmentCard } from "../../../components/doctor/DoctorCard";
import { ErrorState, EmptyState } from "../../../components/ui/ui";
import { ListSkeletonShaped } from "../../../components/ui/Skeletons";
import { CalendarDays } from "lucide-react";

export default function DoctorAppointments() {
  const { data: list, isLoading, isError, refetch } = useDoctorAppointments();
  const update = useUpdateDoctorAppointment();

  if (isLoading) return <ListSkeletonShaped count={4} />;
  if (isError) return <ErrorState message="Could not load appointments." onRetry={() => refetch()} />;
  if (!list || list.length === 0) {
    return <EmptyState icon={<CalendarDays size={30} strokeWidth={2} />} title="No appointments yet" hint="When patients book you, requests appear here." />;
  }

  return (
    <div>
      <h1 className="font-display text-xl font-bold">Appointments ({list.length})</h1>
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
