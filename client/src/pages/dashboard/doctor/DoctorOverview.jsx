import { Link } from "react-router-dom";
import { CalendarClock, CalendarCheck2, Hourglass, ListChecks, ArrowRight } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { useDoctorAppointments } from "../../../hooks/useDoctors";
import { AppointmentCard } from "../../../components/doctor/DoctorCard";
import StatCard from "../../../components/ui/StatCard";
import GradientMesh from "../../../components/ui/GradientMesh";
import { Badge } from "../../../components/ui/ui";
import { StatRowSkeleton, OrderListSkeleton } from "../../../components/ui/Skeletons";

const isToday = (d) => {
  const x = new Date(d);
  const now = new Date();
  return x.getFullYear() === now.getFullYear() && x.getMonth() === now.getMonth() && x.getDate() === now.getDate();
};

const isThisMonth = (d) => {
  const x = new Date(d);
  const now = new Date();
  return x.getFullYear() === now.getFullYear() && x.getMonth() === now.getMonth();
};

export default function DoctorOverview() {
  const { profile } = useAuth();
  const { data, isLoading } = useDoctorAppointments();
  const list = data || [];

  const pending = list.filter((a) => a.status === "pending");
  const done = list.filter((a) => a.status === "delivered");
  const today = list.filter((a) => isToday(a.createdAt));
  const month = list.filter((a) => isThisMonth(a.createdAt));

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-700 via-sky-800 to-ink-950 px-6 py-8 text-white sm:px-8">
        <GradientMesh variant="dark" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">Doctor dashboard</p>
            <h1 className="font-display mt-1 text-2xl font-bold sm:text-3xl">
              Hello, {profile?.name?.split(" ").slice(0, 2).join(" ") || "Doctor"}
            </h1>
            <p className="mt-1 text-sm text-sky-100">
              {today.length} booking(s) today · {pending.length} awaiting your response.
            </p>
          </div>
          <Link
            to="/dashboard/doctor/appointments"
            className="btn-press inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-sky-800 shadow"
          >
            All appointments <ArrowRight size={14} strokeWidth={2.4} />
          </Link>
        </div>
      </section>

      <div className="mt-4">
        {isLoading ? (
          <StatRowSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={Hourglass} label="Pending" value={pending.length} accent="amber" sub="Needs your response" />
            <StatCard icon={CalendarCheck2} label="Completed" value={done.length} accent="emerald" sub="All time" />
            <StatCard icon={CalendarClock} label="Today" value={today.length} accent="sky" sub="Booked today" />
            <StatCard icon={ListChecks} label="This month" value={month.length} accent="teal" sub="Total bookings" />
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="font-display font-bold text-slate-900">Today&apos;s schedule</h2>
        <div className="mt-2 space-y-3">
          {isLoading ? (
            <OrderListSkeleton count={3} />
          ) : today.length === 0 ? (
            <p className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-400">
              No bookings today.{" "}
              <Link to="/dashboard/doctor/appointments" className="font-bold text-sky-700">
                Review all appointments
              </Link>
            </p>
          ) : (
            today.slice(0, 5).map((a) => (
              <div key={a._id} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 font-display text-sm font-bold text-sky-700">
                  {(a.user?.name || "P")[0]?.toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block truncate font-bold">{a.user?.name || a.user?.email || "Patient"}</span>
                  <span className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleTimeString()}</span>
                </span>
                <Badge tone={a.status}>{a.status}</Badge>
              </div>
            ))
          )}
        </div>

        {pending.length > 0 && (
          <>
            <h2 className="font-display mt-6 font-bold text-slate-900">Needs review ({pending.length})</h2>
            <div className="mt-2 space-y-3">
              {pending.slice(0, 3).map((a) => (
                <AppointmentCard key={a._id} appointment={a} />
              ))}
              {pending.length > 3 && (
                <Link to="/dashboard/doctor/appointments" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700">
                  View all {pending.length} pending <ArrowRight size={14} strokeWidth={2.4} />
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
