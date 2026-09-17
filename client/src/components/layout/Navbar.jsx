import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
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
  User as UserIcon,
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
      ? "/dashboard/admin/users"
      : userType === "DOCTOR"
        ? "/dashboard/doctor/appointments"
        : userType === "PATHOLOGIST"
          ? "/dashboard/pathologist/appointments"
          : null;

  const links = [
    { to: "/shop", label: "Shop", icon: Store },
    { to: "/prescriptions/upload", label: "Upload Rx", icon: FileText },
    { to: "/doctors", label: "Doctors", icon: Stethoscope },
    { to: "/labs", label: "Labs", icon: FlaskConical },
    { to: "/chat", label: "Chat", icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white">
            <HeartPulse size={20} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-teal-800">MediTrust</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-800"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => (isLoggedIn ? setOpen(true) : navigate("/login"))}
            className="btn-press relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
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
                  className="rounded-xl bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/account"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <UserIcon size={16} />
                {profile?.name || user?.name || "Account"}
              </Link>
              <button
                onClick={handleLogout}
                className="btn-press rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-press rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="grid gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50"
              >
                <l.icon size={16} /> {l.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50"
                >
                  My Orders
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50"
                >
                  Account
                </Link>
                {dashboardLink && (
                  <Link
                    to={dashboardLink}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-teal-800 hover:bg-teal-50"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-center text-sm font-semibold"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-xl bg-teal-700 px-3 py-2.5 text-center text-sm font-semibold text-white"
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
