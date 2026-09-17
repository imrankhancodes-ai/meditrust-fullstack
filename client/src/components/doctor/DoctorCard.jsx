import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "../ui/ui";
import { useBookDoctor } from "../../hooks/useDoctors";
import { StaggerGroup, StaggerItem } from "../motion/Stagger";
import {
  Stethoscope,
  Building2,
  Wallet,
  CalendarDays,
  ArrowRight,
  Zap,
} from "lucide-react";

export function DoctorCard({ doctor }) {
  const book = useBookDoctor();
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)] hover:shadow-[0_12px_36px_rgba(2,132,199,0.15)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 p-3 text-white shadow-[0_4px_14px_rgba(2,132,199,0.35)]">
          <Stethoscope size={24} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <div className="font-display truncate font-bold text-slate-900">{doctor.user?.name || "Doctor"}</div>
          <div className="text-sm text-slate-500">{doctor.qualification}</div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {(doctor.specialization || []).slice(0, 3).map((s) => (
              <Badge key={s} tone="default">{s}</Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
        <div className="flex items-center gap-2"><Building2 size={14} strokeWidth={2.2} className="shrink-0 text-slate-400" /> {doctor.clinicName}</div>
        <div className="flex items-center gap-2"><Wallet size={14} strokeWidth={2.2} className="shrink-0 text-slate-400" /> <span className="font-display font-bold text-slate-900">₹{doctor.consultationFee}</span>&nbsp;consultation</div>
        <div className="flex items-center gap-2"><CalendarDays size={14} strokeWidth={2.2} className="shrink-0 text-slate-400" /> {(doctor.availableDays || []).join(", ") || "—"}</div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to={`/doctors/${doctor._id}`}
          className="btn-press flex flex-1 items-center justify-center gap-1 rounded-full border border-sky-600 px-3 py-2.5 text-center text-sm font-semibold text-sky-700 hover:bg-sky-50"
        >
          View & book <ArrowRight size={14} strokeWidth={2.4} />
        </Link>
        <button
          onClick={() => book.mutate(doctor._id)}
          disabled={book.isPending}
          className="btn-press flex flex-1 items-center justify-center gap-1 rounded-full bg-sky-600 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(2,132,199,0.35)] hover:bg-sky-700 disabled:opacity-50"
        >
          <Zap size={14} strokeWidth={2.4} /> {book.isPending ? "Booking…" : "Quick book"}
        </button>
      </div>
    </motion.div>
  );
}

export function DoctorGrid({ doctors }) {
  return (
    <StaggerGroup className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
      {doctors.map((d) => (
        <StaggerItem key={d._id} className="h-full">
          <DoctorCard doctor={d} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}

export function SlotPicker({ availableDays, workingHours }) {
  return (
    <div className="rounded-3xl bg-sky-50 p-4 text-sm ring-1 ring-sky-100">
      <div className="flex items-center gap-1.5 font-bold text-sky-900">
        <CalendarDays size={15} strokeWidth={2.2} /> Availability
      </div>
      <div className="mt-1 text-sky-800">
        {(availableDays || []).join(" · ") || "Contact clinic for availability"}
      </div>
      {workingHours && (
        <div className="text-sky-800">
          {workingHours.start} – {workingHours.end}
        </div>
      )}
    </div>
  );
}

export function AppointmentCard({ appointment, onStatus, updating }) {
  const id = appointment._id;
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-bold text-slate-900">
            {appointment.user?.name || appointment.user?.email || "Patient"}
          </span>
          <span className="text-slate-400"> · {new Date(appointment.createdAt).toLocaleString()}</span>
        </div>
        <Badge tone={appointment.status}>{appointment.status}</Badge>
      </div>
      {onStatus && (
        <div className="mt-3 flex gap-2">
          {["pending", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              disabled={updating || appointment.status === s}
              onClick={() => onStatus(id, s)}
              className={`btn-press rounded-full px-3.5 py-1.5 text-xs font-bold ${
                appointment.status === s
                  ? "bg-slate-200 text-slate-500"
                  : s === "cancelled"
                    ? "bg-red-50 text-red-700 hover:bg-red-100"
                    : "bg-teal-50 text-teal-800 hover:bg-teal-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
