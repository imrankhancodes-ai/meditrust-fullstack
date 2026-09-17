import { Link, useParams } from "react-router-dom";
import { useDoctors, useBookDoctor } from "../../hooks/useDoctors";
import { SlotPicker } from "../../components/doctor/DoctorCard";
import { Spinner, ErrorState, Badge, Button } from "../../components/ui/ui";

export default function DoctorProfile() {
  const { did } = useParams();
  const { data: doctors, isLoading, isError, refetch } = useDoctors();
  const book = useBookDoctor();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load doctor." onRetry={() => refetch()} />;

  const doctor = (doctors || []).find((d) => d._id === did);
  if (!doctor) return <ErrorState message="Doctor not found." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/doctors" className="text-sm font-semibold text-teal-700">← All doctors</Link>
      <div className="mt-3 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl">🩺</div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{doctor.user?.name}</h1>
            <p className="text-slate-500">{doctor.qualification} · {doctor.experience} yrs experience</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {(doctor.specialization || []).map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </div>
        </div>

        <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Clinic</dt><dd className="font-bold">{doctor.clinicName}</dd></div>
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Address</dt><dd className="font-bold">{doctor.address}</dd></div>
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Fee</dt><dd className="font-bold">₹{doctor.consultationFee}</dd></div>
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Contact</dt><dd className="font-bold">{doctor.phone || doctor.email || "—"}</dd></div>
        </dl>

        <div className="mt-4">
          <SlotPicker availableDays={doctor.availableDays} workingHours={doctor.workingHours} />
        </div>

        <Button className="mt-5 w-full" disabled={book.isPending} onClick={() => book.mutate(doctor._id)}>
          {book.isPending ? "Booking…" : `Book appointment · ₹${doctor.consultationFee}`}
        </Button>
      </div>
    </div>
  );
}
