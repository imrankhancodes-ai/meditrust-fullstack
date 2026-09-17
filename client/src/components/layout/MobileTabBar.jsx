import { NavLink } from "react-router-dom";
import { Home, Store, FileText, MessageCircle, User as UserIcon } from "lucide-react";
import useAuth from "../../hooks/useAuth";

// Bottom tab bar for logged-in users on small screens.
// Home · Shop · Upload Rx (center, emphasized) · Chat · Account
export default function MobileTabBar() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return null;

  const tabs = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: Store },
    { to: "/prescriptions/upload", label: "Upload Rx", icon: FileText, center: true },
    { to: "/chat", label: "Chat", icon: MessageCircle },
    { to: "/account", label: "Account", icon: UserIcon },
  ];

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/70 bg-white/92 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5 px-1 pt-1.5">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === "/"}
            className={({ isActive }) =>
              `touch-44 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-semibold ${
                isActive ? "text-teal-700" : "text-slate-400"
              }`
            }
          >
            {t.center ? (
              <span className="-mt-6 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-teal-800 p-3.5 text-white shadow-[0_8px_24px_rgba(17,94,89,0.45)] ring-4 ring-slate-50">
                <t.icon size={22} strokeWidth={2.4} />
              </span>
            ) : (
              <t.icon size={21} strokeWidth={2.2} />
            )}
            <span className={t.center ? "mt-0.5" : ""}>{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
