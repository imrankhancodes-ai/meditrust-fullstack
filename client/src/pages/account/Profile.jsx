import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import { setProfile } from "../../redux/slices/authSlice";
import { Input, Button, Card, Badge } from "../../components/ui/ui";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function Profile() {
  const { profile } = useAuth();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    age: profile?.age || "",
    gender: profile?.gender || "",
    address: profile?.address || "",
  });
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-extrabold text-slate-900">My profile</h1>
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
    </div>
  );
}
