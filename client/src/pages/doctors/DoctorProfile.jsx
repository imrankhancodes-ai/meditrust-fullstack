import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Stethoscope, Building2, MapPin, Wallet, Phone } from "lucide-react";
import { useDoctors, useBookDoctor } from "../../hooks/useDoctors";
import { SlotPicker } from "../../components/doctor/DoctorCard";
import { ErrorState, Badge, Button } from "../../components/ui/ui";
import BrandLoader from "../../components/ui/BrandLoader";
import Reveal from "../../components/motion/Reveal";

export default function DoctorProfile() {
  const { did } = useParams();
  const { data: doctors, isLoading, isError, refetch } = useDoctors();
  const book = useBookDoctor();

  if (isLoading) return <BrandLoader label="Loading doctor…" />;
  if (isError) return <ErrorState message="Could not load doctor." onRetry={() => refetch()} />;

  const doctor = (doctors || []).find((d) => d._id === did);
  if (!doctor) return <ErrorState message="Doctor not found." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/doctors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800">
        <ArrowLeft size={15} strokeWidth={2.4} /> All doctors
      </Link>
      <Reveal className="mt-3 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_2px_16px_rgba(15,118,110,0.08)] sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-[0_4px_14px_rgba(2,132,199,0.35)]">
            <Stethoscope size={30} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">{doctor.user?.name}</h1>
            <p className="text-slate-500">{doctor.qualification} · {doctor.experience} yrs experience</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {(doctor.specialization || []).map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </div>
        </div>

        <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-3"><dt className="flex items-center gap-1 text-slate-500"><Building2 size={13} strokeWidth={2.2} /> Clinic</dt><dd className="font-bold">{doctor.clinicName}</dd></div>
          <div className="rounded-2xl bg-slate-50 p-3"><dt className="flex items-center gap-1 text-slate-500"><MapPin size={13} strokeWidth={2.2} /> Address</dt><dd className="font-bold">{doctor.address}</dd></div>
          <div className="rounded-2xl bg-slate-50 p-3"><dt className="flex items-center gap-1 text-slate-500"><Wallet size={13} strokeWidth={2.2} /> Fee</dt><dd className="font-display font-bold">₹{doctor.consultationFee}</dd></div>
          <div className="rounded-2xl bg-slate-50 p-3"><dt className="flex items-center gap-1 text-slate-500"><Phone size={13} strokeWidth={2.2} /> Contact</dt><dd className="font-bold">{doctor.phone || doctor.email || "—"}</dd></div>
        </dl>

        <div className="mt-4">
          <SlotPicker availableDays={doctor.availableDays} workingHours={doctor.workingHours} />
        </div>

        <Button className="mt-5 w-full !bg-sky-600 hover:!bg-sky-700" disabled={book.isPending} onClick={() => book.mutate(doctor._id)}>
          {book.isPending ? "Booking…" : `Book appointment · ₹${doctor.consultationFee}`}
        </Button>
      </Reveal>
    </div>
  );
}
