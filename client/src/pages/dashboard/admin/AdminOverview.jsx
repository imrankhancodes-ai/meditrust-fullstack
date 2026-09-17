import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Package,
  BadgeCheck,
  ShoppingBag,
  Coins,
  IndianRupee,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import adminService from "../../../services/adminService";
import StatCard from "../../../components/ui/StatCard";
import GradientMesh from "../../../components/ui/GradientMesh";
import { StatRowSkeleton } from "../../../components/ui/Skeletons";
import Reveal from "../../../components/motion/Reveal";

export default function AdminOverview() {
  const usersQ = useQuery({ queryKey: ["admin-users"], queryFn: adminService.users });
  const productsQ = useQuery({ queryKey: ["admin-products"], queryFn: adminService.products });
  const doctorsQ = useQuery({ queryKey: ["admin-doctors"], queryFn: adminService.doctors });
  const pathsQ = useQuery({ queryKey: ["admin-pathologists"], queryFn: adminService.pathologists });
  const ordersQ = useQuery({ queryKey: ["admin-orders"], queryFn: adminService.orders });
  const creditsQ = useQuery({
    queryKey: ["admin-credit-requests", "pending"],
    queryFn: () => adminService.creditRequests("pending"),
  });

  const users = usersQ.data || [];
  const byRole = (r) => users.filter((u) => u.userType === r).length;
  const pendingVerifications =
    (doctorsQ.data || []).filter((d) => !d.isVerified).length +
    (pathsQ.data || []).filter((p) => !p.isVerified).length;
  const orders = ordersQ.data || [];
  const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingCredits = (creditsQ.data || []).length;

  const loading =
    usersQ.isLoading || productsQ.isLoading || doctorsQ.isLoading ||
    pathsQ.isLoading || ordersQ.isLoading || creditsQ.isLoading;

  const sections = [
    { to: "/dashboard/admin/users", icon: Users, title: "Users", text: `${users.length} accounts · ${byRole("DOCTOR")} doctors · ${byRole("PATHOLOGIST")} labs` },
    { to: "/dashboard/admin/products", icon: Package, title: "Products", text: `${(productsQ.data || []).length} in catalog` },
    { to: "/dashboard/admin/verifications", icon: BadgeCheck, title: "Verifications", text: `${pendingVerifications} pending review` },
    { to: "/dashboard/admin/orders", icon: ShoppingBag, title: "Orders", text: `${orders.length} orders · ₹${revenue.toLocaleString("en-IN")} revenue` },
    { to: "/dashboard/admin/credits", icon: Coins, title: "Credits", text: `${pendingCredits} requests pending` },
  ];

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-6 py-8 text-white sm:px-8">
        <GradientMesh variant="dark" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Admin dashboard</p>
          <h1 className="font-display mt-1 text-2xl font-bold sm:text-3xl">Platform overview</h1>
          <p className="mt-1 text-sm text-slate-300">
            Users, catalog, verifications, orders and credit requests — one glance.
          </p>
        </div>
      </section>

      <div className="mt-4">
        {loading ? (
          <StatRowSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={Users} label="Total users" value={users.length} accent="ink" sub={`${byRole("USER")} patients`} />
            <StatCard icon={Package} label="Products" value={(productsQ.data || []).length} accent="teal" sub="Live catalog" />
            <StatCard icon={ShoppingBag} label="Orders" value={orders.length} accent="sky" sub={`${orders.filter((o) => o.status === "placed").length} newly placed`} />
            <StatCard icon={IndianRupee} label="Revenue" value={revenue} prefix="₹" accent="emerald" sub="All orders" />
          </div>
        )}
      </div>

      <Reveal className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
            <BadgeCheck size={20} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm font-bold text-amber-900">{pendingVerifications} verification(s) pending</div>
            <div className="text-xs text-amber-700">Doctors & labs waiting for approval</div>
          </div>
          <Link to="/dashboard/admin/verifications" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-600 px-3.5 py-2 text-xs font-bold text-white">
            Review <ArrowUpRight size={13} strokeWidth={2.6} />
          </Link>
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-teal-200 bg-teal-50 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
            <Coins size={20} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm font-bold text-teal-900">{pendingCredits} credit request(s) pending</div>
            <div className="text-xs text-teal-700">Prescription-parse top-ups</div>
          </div>
          <Link to="/dashboard/admin/credits" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-700 px-3.5 py-2 text-xs font-bold text-white">
            Review <ArrowUpRight size={13} strokeWidth={2.6} />
          </Link>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="group flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white transition group-hover:bg-teal-700">
              <s.icon size={20} strokeWidth={2.2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display block text-sm font-bold text-slate-900">{s.title}</span>
              <span className="block truncate text-xs text-slate-400">{s.text}</span>
            </span>
            <ArrowRight size={16} strokeWidth={2.4} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700" />
          </Link>
        ))}
      </div>
    </div>
  );
}
