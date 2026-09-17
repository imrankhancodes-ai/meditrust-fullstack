import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import { setCredentials, setProfile } from "../../redux/slices/authSlice";
import { Input, Button, Card } from "../../components/ui/ui";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

function redirectFor(userType, from) {
  if (from && from !== "/login" && from !== "/register") return from;
  if (userType === "ADMIN") return "/dashboard/admin/users";
  if (userType === "DOCTOR") return "/dashboard/doctor/appointments";
  if (userType === "PATHOLOGIST") return "/dashboard/pathologist/appointments";
  return "/";
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
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Log in to order medicines, book care and track prescriptions.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Email" type="email" value={form.email} error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          No account? <Link to="/register" className="font-bold text-teal-700">Sign up</Link>
        </p>
      </Card>
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
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">One account for medicines, doctors, labs and chat.</p>
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
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Have an account? <Link to="/login" className="font-bold text-teal-700">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
