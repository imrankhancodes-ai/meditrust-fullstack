import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RefreshCw, Coins, Stethoscope, FlaskConical, ArrowRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import { setProfile } from "../../redux/slices/authSlice";
import { useMyDoctorAppointments, useMyPathologyAppointments } from "../../hooks/useDoctors";
import { useCredits, useMyCreditRequests } from "../../hooks/usePrescriptions";
import { Input, Button, Card, Badge } from "../../components/ui/ui";
import { OrderRowSkeleton } from "../../components/ui/Skeletons";
import GradientMesh from "../../components/ui/GradientMesh";
import Reveal from "../../components/motion/Reveal";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function Profile() {
  const { profile } = useAuth();
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    age: profile?.age || "",
    gender: profile?.gender || "",
    address: profile?.address || "",
  });
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const doctorsQ = useMyDoctorAppointments();
  const labsQ = useMyPathologyAppointments();
  const creditsQ = useCredits();
  const creditRequestsQ = useMyCreditRequests();

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateMe({
        name: form.name,
        phone: form.phone,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        address: form.address || undefined,
      });
      dispatch(setProfile(updated));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(errMsg(err, "Update failed"));
    } finally {
      setSaving(false);
    }
  };

  // Picks up a new role after admin verification without re-login
  const refresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await authService.me();
      dispatch(setProfile(fresh));
      qc.invalidateQueries();
      toast.success("Profile refreshed");
    } catch (err) {
      toast.error(errMsg(err, "Refresh failed"));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">My profile</h1>
        <button
          onClick={refresh}
          disabled={refreshing}
          title="Re-fetch profile (picks up a new role after admin verification)"
          className="btn-press flex items-center gap-1.5 rounded-full border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} strokeWidth={2.4} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <Reveal>
        <Card className="relative mt-4 overflow-hidden">
          <GradientMesh />
          <div className="relative flex items-center gap-3">
            <div className="font-display flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 text-xl font-bold text-white shadow-[0_4px_14px_rgba(17,94,89,0.4)]">
              {(profile?.name || "?")[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-display font-bold text-slate-900">{profile?.name}</div>
              <div className="text-sm text-slate-500">{profile?.email}</div>
              <div className="mt-1"><Badge tone="default">{profile?.userType}</Badge></div>
            </div>
          </div>
          <form onSubmit={submit} className="relative mt-5 space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Age" type="number" min={0} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Gender</span>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-teal-600 focus:outline-none"
                >
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Address</span>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            </label>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </Card>
      </Reveal>

      <h2 className="font-display mt-8 flex items-center gap-1.5 text-lg font-bold text-slate-900">
        <Coins size={18} strokeWidth={2.2} className="text-teal-700" /> Prescription credits
      </h2>
      <Card className="mt-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-3xl font-bold text-teal-800">
              {creditsQ.isLoading ? "…" : (creditsQ.data?.credits ?? profile?.prescriptionCredits ?? "—")}
            </div>
            <div className="text-xs text-slate-400">1 credit = 1 prescription parse · new accounts start with 3</div>
          </div>
          <Link to="/prescriptions/upload" className="btn-press inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)]">
            Upload / Request <ArrowRight size={14} strokeWidth={2.4} />
          </Link>
        </div>
        <div className="mt-3 border-t border-slate-100 pt-3">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Request history</div>
          {creditRequestsQ.isLoading ? (
            <div className="mt-2"><OrderRowSkeleton /></div>
          ) : !creditRequestsQ.data || creditRequestsQ.data.length === 0 ? (
            <p className="mt-1 text-sm text-slate-400">No credit requests yet.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {creditRequestsQ.data.map((r) => (
                <div key={r._id} className="flex items-center justify-between gap-2 text-sm">
                  <span>
                    <span className="font-display font-bold">+{r.requestedCredits}</span>
                    <span className="ml-2 text-xs text-slate-400">{new Date(r.createdAt).toLocaleString()}</span>
                    {r.status === "approved" && <span className="ml-2 text-xs text-slate-500">granted: {r.grantedCredits}</span>}
                  </span>
                  <Badge tone={r.status === "approved" ? "delivered" : r.status === "rejected" ? "cancelled" : "pending"}>{r.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <h2 className="font-display mt-8 flex items-center gap-1.5 text-lg font-bold text-slate-900">
        <Stethoscope size={18} strokeWidth={2.2} className="text-sky-700" /> My doctor appointments
      </h2>
      <div className="mt-2">
        {doctorsQ.isLoading ? (
          <OrderRowSkeleton count={2} />
        ) : !doctorsQ.data || doctorsQ.data.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No doctor appointments yet.{" "}
            <Link to="/doctors" className="inline-flex items-center gap-1 font-bold text-sky-700">
              Find a doctor <ArrowRight size={13} strokeWidth={2.4} />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {doctorsQ.data.map((a) => (
              <div key={a._id} className="flex items-center justify-between gap-2 rounded-3xl border border-slate-100 bg-white p-3.5 text-sm shadow-sm">
                <div>
                  <div className="font-bold text-slate-900">
                    {a.doctor?.clinicName || "Clinic"}
                    <span className="ml-1 font-normal text-slate-500">· {a.doctor?.qualification || ""}</span>
                  </div>
                  <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <Badge tone={a.status}>{a.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 className="font-display mt-6 flex items-center gap-1.5 text-lg font-bold text-slate-900">
        <FlaskConical size={18} strokeWidth={2.2} className="text-violet-700" /> My lab bookings
      </h2>
      <div className="mt-2">
        {labsQ.isLoading ? (
          <OrderRowSkeleton count={2} />
        ) : !labsQ.data || labsQ.data.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No lab bookings yet.{" "}
            <Link to="/labs" className="inline-flex items-center gap-1 font-bold text-violet-700">
              Browse labs <ArrowRight size={13} strokeWidth={2.4} />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {labsQ.data.map((a) => (
              <div key={a._id} className="flex items-center justify-between gap-2 rounded-3xl border border-slate-100 bg-white p-3.5 text-sm shadow-sm">
                <div>
                  <div className="font-bold text-slate-900">
                    {a.pathologyTest?.title || "Test"}
                    <span className="ml-1 font-normal text-slate-500">· {a.pathologist?.laboratoryName || ""}</span>
                  </div>
                  <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <Badge tone={a.status}>{a.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
