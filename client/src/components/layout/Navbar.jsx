import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  HeartPulse,
  ShoppingCart,
  Menu,
  X,
  MessageCircle,
  FileText,
  Stethoscope,
  FlaskConical,
  Store,
  Coins,
  User as UserIcon,
  LayoutDashboard,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useCartDrawer } from "../../hooks/useCart";

export default function Navbar() {
  const { isLoggedIn, user, profile, userType, doLogout } = useAuth();
  const cart = useSelector((s) => s.cart);
  const { setOpen } = useCartDrawer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    doLogout();
    navigate("/");
  };

  const dashboardLink =
    userType === "ADMIN"
      ? "/dashboard/admin"
      : userType === "DOCTOR"
        ? "/dashboard/doctor"
        : userType === "PATHOLOGIST"
          ? "/dashboard/pathologist"
          : userType === "USER"
            ? "/dashboard"
            : null;

  const links = [
    { to: "/shop", label: "Shop", icon: Store },
    { to: "/prescriptions/upload", label: "Upload Rx", icon: FileText },
    { to: "/doctors", label: "Doctors", icon: Stethoscope },
    { to: "/labs", label: "Labs", icon: FlaskConical },
    { to: "/chat", label: "Chat", icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-[0_4px_14px_rgba(17,94,89,0.4)]">
            <HeartPulse size={20} strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-teal-800">MediTrust</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50/80 p-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive ? "text-teal-900" : "text-slate-500 hover:text-teal-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_2px_10px_rgba(15,118,110,0.15)] ring-1 ring-teal-100"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <span className="relative font-semibold">{l.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {isLoggedIn && userType !== "ADMIN" && (
            <Link
              to="/prescriptions/upload"
              title="Prescription parsing credits"
              className="hidden items-center gap-1.5 rounded-full bg-teal-50 px-3 py-2 text-xs font-extrabold text-teal-800 ring-1 ring-teal-100 hover:bg-teal-100 sm:inline-flex"
            >
              <Coins size={14} strokeWidth={2.4} />
              {profile?.prescriptionCredits ?? "—"}
            </Link>
          )}
          <button
            onClick={() => (isLoggedIn ? setOpen(true) : navigate("/login"))}
            className="btn-press touch-44 relative flex items-center justify-center rounded-full p-2.5 text-slate-600 hover:bg-slate-100"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} strokeWidth={2.2} />
            {cart.count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-700 px-1 text-[11px] font-bold text-white">
                {cart.count}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <div className="hidden items-center gap-2 md:flex">
              {dashboardLink && (
                <Link
                  to={dashboardLink}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(11,17,32,0.35)] hover:bg-ink-800"
                >
                  <LayoutDashboard size={15} strokeWidth={2.2} />
                  Dashboard
                </Link>
              )}
              <Link
                to="/account"
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <UserIcon size={16} strokeWidth={2.2} />
                {profile?.name || user?.name || "Account"}
              </Link>
              <button
                onClick={handleLogout}
                className="btn-press rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-press rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)] hover:bg-teal-800"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            className="touch-44 flex items-center justify-center rounded-full p-2.5 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="grid gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50"
              >
                <l.icon size={17} strokeWidth={2.2} /> {l.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50"
                >
                  My Orders
                </Link>
                <Link
                  to="/prescriptions"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50"
                >
                  My Prescriptions
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50"
                >
                  Account
                </Link>
                {dashboardLink && (
                  <Link
                    to={dashboardLink}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl px-3 py-2.5 text-sm font-semibold text-teal-800 hover:bg-teal-50"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-full border border-slate-300 px-3 py-2.5 text-center text-sm font-semibold"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-full bg-teal-700 px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
