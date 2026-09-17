import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="text-6xl">🧭</div>
      <h1 className="mt-4 text-2xl font-extrabold">Page not found</h1>
      <p className="mt-1 text-sm text-slate-500">This page doesn&apos;t exist or moved.</p>
      <Link to="/" className="btn-press mt-5 inline-block rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-bold text-white">
        Go home
      </Link>
    </div>
  );
}
