import { Link } from "react-router-dom";
import {
  ShoppingBag,
  FileText,
  CalendarDays,
  Coins,
  FlaskConical,
  Store,
  Stethoscope,
  UploadCloud,
  ArrowRight,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { useMyOrders } from "../../../hooks/useOrders";
import { useMyPrescriptions, useCredits } from "../../../hooks/usePrescriptions";
import { useMyDoctorAppointments, useMyPathologyAppointments } from "../../../hooks/useDoctors";
import StatCard from "../../../components/ui/StatCard";
import GradientMesh from "../../../components/ui/GradientMesh";
import { Badge } from "../../../components/ui/ui";
import { StatRowSkeleton, OrderListSkeleton } from "../../../components/ui/Skeletons";
import Reveal from "../../../components/motion/Reveal";

const QUICK_ACTIONS = [
  { to: "/prescriptions/upload", icon: UploadCloud, title: "Upload prescription", text: "AI reads it in seconds" },
  { to: "/shop", icon: Store, title: "Browse shop", text: "Live stock & prices" },
  { to: "/doctors", icon: Stethoscope, title: "Book a doctor", text: "Verified practitioners" },
  { to: "/labs", icon: FlaskConical, title: "Book a test", text: "Labs near you" },
];

export default function PatientOverview() {
  const { profile } = useAuth();
  const ordersQ = useMyOrders();
  const rxQ = useMyPrescriptions();
  const creditsQ = useCredits();
  const docQ = useMyDoctorAppointments();
  const labQ = useMyPathologyAppointments();

  const orders = ordersQ.data || [];
  const prescriptions = rxQ.data || [];
  const docAppts = docQ.data || [];
  const labBookings = labQ.data || [];
  const upcoming = [...docAppts, ...labBookings].slice(0, 5);

  const loadingStats = ordersQ.isLoading || rxQ.isLoading || creditsQ.isLoading || docQ.isLoading || labQ.isLoading;

  return (
    <div>
      {/* welcome header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-6 py-8 text-white sm:px-8">
        <GradientMesh variant="dark" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">Patient dashboard</p>
          <h1 className="font-display mt-1 text-2xl font-bold sm:text-3xl">
            Welcome back, {profile?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Your medicines, prescriptions, appointments and credits — at a glance.
          </p>
        </div>
      </section>

      {/* stats */}
      <div className="mt-4">
        {loadingStats ? (
          <StatRowSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={ShoppingBag} label="Orders" value={orders.length} accent="teal" sub={orders[0] ? `Latest: ${orders[0].status}` : "No orders yet"} />
            <StatCard icon={FileText} label="Prescriptions" value={prescriptions.length} accent="sky" sub="AI-analyzed uploads" />
            <StatCard icon={CalendarDays} label="Upcoming visits" value={docAppts.length + labBookings.length} accent="violet" sub={`${docAppts.length} doctor · ${labBookings.length} lab`} />
            <StatCard icon={Coins} label="Credits left" value={creditsQ.data?.credits ?? profile?.prescriptionCredits ?? 0} accent="amber" sub="1 credit = 1 parse" />
          </div>
        )}
      </div>

      {/* quick actions */}
      <Reveal className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="group flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
              <a.icon size={20} strokeWidth={2.2} />
            </span>
            <span className="min-w-0">
              <span className="font-display block truncate text-sm font-bold text-slate-900">{a.title}</span>
              <span className="block truncate text-xs text-slate-400">{a.text}</span>
            </span>
          </Link>
        ))}
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* recent activity */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-slate-900">Recent activity</h2>
            <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-bold text-teal-700">
              All orders <ArrowRight size={13} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="mt-2 space-y-2">
            {ordersQ.isLoading || rxQ.isLoading ? (
              <OrderListSkeleton count={3} />
            ) : orders.length === 0 && prescriptions.length === 0 ? (
              <p className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-400">
                No activity yet — upload a prescription or place an order to get started.
              </p>
            ) : (
              <>
                {orders.slice(0, 3).map((o) => (
                  <Link key={o._id} to={`/orders/${o._id}`} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-3.5 shadow-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <ShoppingBag size={18} strokeWidth={2.2} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block truncate font-bold">Order · ₹{o.totalAmount}</span>
                      <span className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleString()}</span>
                    </span>
                    <Badge tone={o.status}>{o.status}</Badge>
                  </Link>
                ))}
                {prescriptions.slice(0, 2).map((p) => (
                  <Link key={p._id} to={`/prescriptions/${p._id}`} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-3.5 shadow-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                      <FileText size={18} strokeWidth={2.2} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block truncate font-bold">{p.patient_name || "Prescription"} · {p.medicines?.length || 0} medicine(s)</span>
                      <span className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleString()}</span>
                    </span>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        {/* upcoming */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-slate-900">Upcoming</h2>
            <Link to="/account" className="inline-flex items-center gap-1 text-xs font-bold text-teal-700">
              View all <ArrowRight size={13} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="mt-2 space-y-2">
            {docQ.isLoading || labQ.isLoading ? (
              <OrderListSkeleton count={3} />
            ) : upcoming.length === 0 ? (
              <p className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-400">
                Nothing booked yet — find a doctor or a lab to get started.
              </p>
            ) : (
              upcoming.map((a) => (
                <div key={a._id} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-3.5 shadow-sm">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${a.doctor ? "bg-sky-50 text-sky-700" : "bg-violet-50 text-violet-700"}`}>
                    {a.doctor ? <Stethoscope size={18} strokeWidth={2.2} /> : <FlaskConical size={18} strokeWidth={2.2} />}
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block truncate font-bold">
                      {a.doctor ? a.doctor?.clinicName || "Doctor visit" : a.pathologyTest?.title || "Lab test"}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</span>
                  </span>
                  <Badge tone={a.status}>{a.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
