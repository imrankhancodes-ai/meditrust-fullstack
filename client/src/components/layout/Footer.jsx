import { Link } from "react-router-dom";
import { HeartPulse, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white">
              <HeartPulse size={19} strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-teal-800">MediTrust</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
            Upload a prescription, get it explained, order what&apos;s available, book
            what&apos;s needed, ask what&apos;s unclear.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            <ShieldCheck size={13} strokeWidth={2.4} /> AI-assisted, pharmacist-verified flow
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold text-slate-900">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/shop" className="transition hover:text-teal-700">All medicines</Link></li>
            <li><Link to="/prescriptions/upload" className="transition hover:text-teal-700">Upload prescription</Link></li>
            <li><Link to="/orders" className="transition hover:text-teal-700">My orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold text-slate-900">Care</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/doctors" className="transition hover:text-teal-700">Find doctors</Link></li>
            <li><Link to="/labs" className="transition hover:text-teal-700">Book lab tests</Link></li>
            <li><Link to="/chat" className="transition hover:text-teal-700">Health chat</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold text-slate-900">Join</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/become-doctor" className="transition hover:text-teal-700">Become a doctor</Link></li>
            <li><Link to="/become-pathologist" className="transition hover:text-teal-700">Become a pathologist</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-4 text-center text-xs text-slate-400">
        MediTrust is for education and demonstration only — not a certified medical product. Always
        verify with a licensed professional.
      </div>
    </footer>
  );
}
