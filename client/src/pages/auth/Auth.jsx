import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { HeartPulse, FileText, Store, Stethoscope, ShieldCheck, ArrowRight } from "lucide-react";
import authService from "../../services/authService";
import { setCredentials, setProfile } from "../../redux/slices/authSlice";
import { Input, Button } from "../../components/ui/ui";
import GradientMesh from "../../components/ui/GradientMesh";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

function redirectFor(userType, from) {
  if (from && from !== "/login" && from !== "/register") return from;
  if (userType === "ADMIN") return "/dashboard/admin";
  if (userType === "DOCTOR") return "/dashboard/doctor";
  if (userType === "PATHOLOGIST") return "/dashboard/pathologist";
  return "/dashboard";
}

function AuthShell({ children, title, sub }) {
  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_8px_40px_rgba(15,118,110,0.12)] lg:grid-cols-2">
      {/* dark brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-8 text-white lg:flex">
        <GradientMesh variant="dark" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white">
              <HeartPulse size={22} strokeWidth={2.2} />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">MediTrust</span>
          </div>
          <h2 className="font-display mt-10 text-3xl font-bold leading-tight">
            Your pharmacy,
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-glow-500 bg-clip-text text-transparent">
              doctor & lab
            </span>
            <br />
            in one place.
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            {[
              { icon: FileText, text: "AI prescription reading in ~30 seconds" },
              { icon: Store, text: "Live stock with alternative brands" },
              { icon: Stethoscope, text: "Verified doctors & diagnostic labs" },
            ].map((f) => (
              <li key={f.text} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-teal-200">
                  <f.icon size={16} strokeWidth={2.2} />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={14} strokeWidth={2.2} className="text-teal-300" />
          Demo product — always verify with a licensed professional.
        </p>
      </div>
      {/* form panel */}
      <div className="relative p-6 sm:p-10">
        <GradientMesh />
        <div className="relative">
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const qc = useQueryClient();

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const data = await authService.login(form);
      dispatch(setCredentials({ token: data.token, name: data.name, email: data.email, phone: data.phone }));
      const profile = await authService.me();
      dispatch(setProfile(profile));
      qc.invalidateQueries();
      toast.success(`Welcome back, ${profile.name || data.name}!`);
      navigate(redirectFor(profile.userType, location.state?.from), { replace: true });
    } catch (err) {
      toast.error(errMsg(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <AuthShell title="Welcome back" sub="Log in to order medicines, book care and track prescriptions.">
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Email" type="email" value={form.email} error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : <>Log in <ArrowRight size={15} strokeWidth={2.4} /></>}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          No account? <Link to="/register" className="font-bold text-teal-700">Sign up</Link>
        </p>
      </AuthShell>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    if (!form.phone) errs.phone = "Phone is required";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "At least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await authService.register(form);
      // auto-login for a smooth first run
      const data = await authService.login({ email: form.email, password: form.password });
      dispatch(setCredentials({ token: data.token, name: data.name, email: data.email, phone: data.phone }));
      const profile = await authService.me();
      dispatch(setProfile(profile));
      toast.success("Account created — welcome to MediTrust!");
      navigate(redirectFor(profile.userType), { replace: true });
    } catch (err) {
      toast.error(errMsg(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <AuthShell title="Create your account" sub="One account for medicines, doctors, labs and chat.">
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Full name" value={form.name} error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" />
          <Input label="Email" type="email" value={form.email} error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <Input label="Phone" value={form.phone} error={errors.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
          <Input label="Password" type="password" value={form.password} error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : <>Sign up <ArrowRight size={15} strokeWidth={2.4} /></>}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Have an account? <Link to="/login" className="font-bold text-teal-700">Log in</Link>
        </p>
      </AuthShell>
    </div>
  );
}
