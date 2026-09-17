import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Hourglass, FlaskConical, CalendarCheck2, ListChecks, ArrowRight } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { usePathologistAppointments } from "../../../hooks/useDoctors";
import pathologistService from "../../../services/pathologistService";
import { AppointmentCard } from "../../../components/doctor/DoctorCard";
import StatCard from "../../../components/ui/StatCard";
import GradientMesh from "../../../components/ui/GradientMesh";
import { Badge } from "../../../components/ui/ui";
import { StatRowSkeleton, OrderListSkeleton } from "../../../components/ui/Skeletons";

const isThisMonth = (d) => {
  const x = new Date(d);
  const now = new Date();
  return x.getFullYear() === now.getFullYear() && x.getMonth() === now.getMonth();
};

export default function PathologistOverview() {
  const { profile } = useAuth();
  const apptsQ = usePathologistAppointments();
  const testsQ = useQuery({ queryKey: ["my-tests"], queryFn: pathologistService.tests });

  const list = apptsQ.data || [];
  const tests = testsQ.data || [];
  const pending = list.filter((a) => a.status === "pending");
  const done = list.filter((a) => a.status === "delivered");
  const month = list.filter((a) => isThisMonth(a.createdAt));

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-700 via-violet-800 to-ink-950 px-6 py-8 text-white sm:px-8">
        <GradientMesh variant="dark" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">Lab dashboard</p>
            <h1 className="font-display mt-1 text-2xl font-bold sm:text-3xl">
              Hello, {profile?.name?.split(" ").slice(0, 2).join(" ") || "Pathologist"}
            </h1>
            <p className="mt-1 text-sm text-violet-100">
              {tests.length} test(s) offered · {pending.length} booking(s) awaiting confirmation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/dashboard/pathologist/tests"
              className="btn-press inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-violet-800 shadow"
            >
              Manage tests <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
            <Link
              to="/dashboard/pathologist/appointments"
              className="btn-press inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
            >
              Appointments
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-4">
        {apptsQ.isLoading || testsQ.isLoading ? (
          <StatRowSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={Hourglass} label="Pending bookings" value={pending.length} accent="amber" sub="Needs confirmation" />
            <StatCard icon={FlaskConical} label="Tests offered" value={tests.length} accent="violet" sub="In your catalog" />
            <StatCard icon={CalendarCheck2} label="Completed" value={done.length} accent="emerald" sub="All time" />
            <StatCard icon={ListChecks} label="This month" value={month.length} accent="teal" sub="Total bookings" />
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display font-bold text-slate-900">Latest bookings</h2>
          <div className="mt-2 space-y-3">
            {apptsQ.isLoading ? (
              <OrderListSkeleton count={3} />
            ) : list.length === 0 ? (
              <p className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-400">
                No bookings yet.
              </p>
            ) : (
              list.slice(0, 4).map((a) => (
                <div key={a._id} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-3.5 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <FlaskConical size={18} strokeWidth={2.2} />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block truncate font-bold">{a.pathologyTest?.title || "Test"}</span>
                    <span className="text-xs text-slate-400">
                      {a.user?.name || a.user?.email || "Patient"} · {new Date(a.createdAt).toLocaleString()}
                    </span>
                  </span>
                  <Badge tone={a.status}>{a.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-slate-900">Test catalog</h2>
            <Link to="/dashboard/pathologist/tests" className="inline-flex items-center gap-1 text-xs font-bold text-violet-700">
              Manage <ArrowRight size={13} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="mt-2 space-y-2">
            {testsQ.isLoading ? (
              <OrderListSkeleton count={3} />
            ) : tests.length === 0 ? (
              <p className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-400">
                No tests yet.{" "}
                <Link to="/dashboard/pathologist/tests" className="font-bold text-violet-700">
                  Add your first test
                </Link>
              </p>
            ) : (
              tests.slice(0, 5).map((t) => (
                <div key={t._id} className="flex items-center justify-between gap-2 rounded-3xl border border-slate-100 bg-white p-3.5 text-sm shadow-sm">
                  <span className="font-bold">{t.title}</span>
                  <span className="font-display font-bold text-violet-700">₹{t.price}</span>
                </div>
              ))
            )}
          </div>
          {pending.length > 0 && (
            <>
              <h2 className="font-display mt-6 font-bold text-slate-900">Needs review ({pending.length})</h2>
              <div className="mt-2 space-y-3">
                {pending.slice(0, 2).map((a) => (
                  <AppointmentCard key={a._id} appointment={a} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
