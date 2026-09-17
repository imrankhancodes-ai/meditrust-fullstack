import { NavLink } from "react-router-dom";
import {
  Users,
  Package,
  BadgeCheck,
  ShoppingBag,
  Coins,
  CalendarDays,
  FlaskConical,
  LayoutDashboard,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { roleAccent } from "../ui/roleTheme";

export default function DashboardSidebar() {
  const { userType } = useAuth();
  const accent = roleAccent(userType);

  const groups = {
    ADMIN: [
      { to: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
      { to: "/dashboard/admin/users", label: "Users", icon: Users },
      { to: "/dashboard/admin/products", label: "Products", icon: Package },
      { to: "/dashboard/admin/verifications", label: "Verifications", icon: BadgeCheck },
      { to: "/dashboard/admin/orders", label: "Orders", icon: ShoppingBag },
      { to: "/dashboard/admin/credits", label: "Credits", icon: Coins },
    ],
    DOCTOR: [
      { to: "/dashboard/doctor", label: "Overview", icon: LayoutDashboard },
      { to: "/dashboard/doctor/appointments", label: "Appointments", icon: CalendarDays },
    ],
    PATHOLOGIST: [
      { to: "/dashboard/pathologist", label: "Overview", icon: LayoutDashboard },
      { to: "/dashboard/pathologist/appointments", label: "Appointments", icon: CalendarDays },
      { to: "/dashboard/pathologist/tests", label: "My Tests", icon: FlaskConical },
    ],
    USER: [{ to: "/dashboard", label: "Overview", icon: LayoutDashboard }],
  };

  const items = groups[userType] || [];

  return (
    <aside className="w-full shrink-0 rounded-3xl border border-slate-100 bg-white p-3 shadow-[0_2px_16px_rgba(15,118,110,0.08)] lg:w-60">
      <div className="mb-2 flex items-center gap-2 px-2 pt-1">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-extrabold text-white ${accent.dot}`}>
          {accent.label[0]}
        </span>
        <div>
          <div className="text-sm font-extrabold text-slate-900">{accent.label} area</div>
          <div className="text-[11px] font-medium text-slate-400">MediTrust dashboard</div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.to === "/dashboard" || i.to === "/dashboard/doctor" || i.to === "/dashboard/pathologist" || i.to === "/dashboard/admin"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive ? accent.active : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            <i.icon size={17} strokeWidth={2.2} />
            {i.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
