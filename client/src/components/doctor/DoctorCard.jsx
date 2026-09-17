import { Link } from "react-router-dom";
import { Badge } from "../ui/ui";
import { useBookDoctor } from "../../hooks/useDoctors";

export function DoctorCard({ doctor }) {
  const book = useBookDoctor();
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl">🩺</div>
        <div className="min-w-0">
          <div className="truncate font-bold text-slate-900">{doctor.user?.name || "Doctor"}</div>
          <div className="text-sm text-slate-500">{doctor.qualification}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {(doctor.specialization || []).slice(0, 3).map((s) => (
              <Badge key={s} tone="default">{s}</Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-sm text-slate-600">
        <div>🏥 {doctor.clinicName}</div>
        <div>💰 ₹{doctor.consultationFee} consultation</div>
        <div>🕒 {(doctor.availableDays || []).join(", ") || "—"}</div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to={`/doctors/${doctor._id}`}
          className="btn-press flex-1 rounded-xl border border-teal-700 px-3 py-2.5 text-center text-sm font-semibold text-teal-800 hover:bg-teal-50"
        >
          View & book
        </Link>
        <button
          onClick={() => book.mutate(doctor._id)}
          disabled={book.isPending}
          className="btn-press flex-1 rounded-xl bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {book.isPending ? "Booking…" : "Quick book"}
        </button>
      </div>
    </div>
  );
}

export function SlotPicker({ availableDays, workingHours }) {
  return (
    <div className="rounded-2xl bg-teal-50 p-4 text-sm">
      <div className="font-bold text-teal-900">Availability</div>
      <div className="mt-1 text-teal-800">
        {(availableDays || []).join(" · ") || "Contact clinic for availability"}
      </div>
      {workingHours && (
        <div className="text-teal-800">
          {workingHours.start} – {workingHours.end}
        </div>
      )}
    </div>
  );
}

export function AppointmentCard({ appointment, onStatus, updating }) {
  const id = appointment._id;
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
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
              className={`btn-press rounded-lg px-3 py-1.5 text-xs font-bold ${
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
