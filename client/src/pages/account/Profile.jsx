import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import { setProfile } from "../../redux/slices/authSlice";
import { useMyDoctorAppointments, useMyPathologyAppointments } from "../../hooks/useDoctors";
import { Input, Button, Card, Badge, Spinner } from "../../components/ui/ui";

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
        <h1 className="text-2xl font-extrabold text-slate-900">My profile</h1>
        <button
          onClick={refresh}
          disabled={refreshing}
          title="Re-fetch profile (picks up a new role after admin verification)"
          className="btn-press flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <Card className="mt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-xl font-extrabold text-white">
            {(profile?.name || "?")[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900">{profile?.name}</div>
            <div className="text-sm text-slate-500">{profile?.email}</div>
            <div className="mt-1"><Badge tone="default">{profile?.userType}</Badge></div>
          </div>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Age" type="number" min={0} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Gender</span>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
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
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-600 focus:outline-none"
            />
          </label>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Card>

      <h2 className="mt-8 text-lg font-extrabold text-slate-900">My doctor appointments</h2>
      <div className="mt-2">
        {doctorsQ.isLoading ? (
          <Spinner />
        ) : !doctorsQ.data || doctorsQ.data.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No doctor appointments yet.{" "}
            <Link to="/doctors" className="font-bold text-teal-700">Find a doctor →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {doctorsQ.data.map((a) => (
              <div key={a._id} className="flex items-center justify-between gap-2 rounded-2xl bg-white p-3.5 text-sm shadow-sm">
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

      <h2 className="mt-6 text-lg font-extrabold text-slate-900">My lab bookings</h2>
      <div className="mt-2">
        {labsQ.isLoading ? (
          <Spinner />
        ) : !labsQ.data || labsQ.data.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No lab bookings yet.{" "}
            <Link to="/labs" className="font-bold text-teal-700">Browse labs →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {labsQ.data.map((a) => (
              <div key={a._id} className="flex items-center justify-between gap-2 rounded-2xl bg-white p-3.5 text-sm shadow-sm">
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
