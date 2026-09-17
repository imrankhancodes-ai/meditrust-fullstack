import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function DashboardSidebar() {
  const { userType } = useAuth();

  const groups = {
    ADMIN: [
      { to: "/dashboard/admin/users", label: "Users" },
      { to: "/dashboard/admin/products", label: "Products" },
      { to: "/dashboard/admin/verifications", label: "Verifications" },
      { to: "/dashboard/admin/orders", label: "Orders" },
    ],
    DOCTOR: [{ to: "/dashboard/doctor/appointments", label: "Appointments" }],
    PATHOLOGIST: [
      { to: "/dashboard/pathologist/appointments", label: "Appointments" },
      { to: "/dashboard/pathologist/tests", label: "My Tests" },
    ],
  };

  const items = groups[userType] || [];

  return (
    <aside className="w-full shrink-0 rounded-2xl bg-white p-3 shadow-[0_2px_16px_rgba(15,118,110,0.08)] lg:w-56">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold ${
                isActive ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"
              }`
            }
          >
            {i.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
