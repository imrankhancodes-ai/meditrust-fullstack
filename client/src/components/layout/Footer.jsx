import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
              <HeartPulse size={18} />
            </span>
            <span className="font-extrabold text-teal-800">MediTrust</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Upload a prescription → get it explained → order what&apos;s available → book
            what&apos;s needed → ask what&apos;s unclear.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Shop</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-500">
            <li><Link to="/shop" className="hover:text-teal-700">All medicines</Link></li>
            <li><Link to="/prescriptions/upload" className="hover:text-teal-700">Upload prescription</Link></li>
            <li><Link to="/orders" className="hover:text-teal-700">My orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Care</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-500">
            <li><Link to="/doctors" className="hover:text-teal-700">Find doctors</Link></li>
            <li><Link to="/labs" className="hover:text-teal-700">Book lab tests</Link></li>
            <li><Link to="/chat" className="hover:text-teal-700">Health chat</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Join</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-500">
            <li><Link to="/become-doctor" className="hover:text-teal-700">Become a doctor</Link></li>
            <li><Link to="/become-pathologist" className="hover:text-teal-700">Become a pathologist</Link></li>
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
