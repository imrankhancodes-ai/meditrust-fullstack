import { useState } from "react";
import toast from "react-hot-toast";
import { Hourglass } from "lucide-react";
import pathologistService from "../../services/pathologistService";
import { Input, Button, Card } from "../../components/ui/ui";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function BecomePathologist() {
  const [form, setForm] = useState({
    laboratoryName: "", laboratoryAddress: "", qualification: "", registrationNumber: "",
    experience: "", specialization: "", phone: "", email: "",
    consultationFee: "", start: "", end: "", availableDays: [],
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleDay = (d) =>
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(d)
        ? f.availableDays.filter((x) => x !== d)
        : [...f.availableDays, d],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pathologistService.request({
        laboratoryName: form.laboratoryName,
        laboratoryAddress: form.laboratoryAddress,
        qualification: form.qualification,
        registrationNumber: form.registrationNumber,
        experience: Number(form.experience),
        specialization: form.specialization.split(",").map((s) => s.trim()).filter(Boolean),
        phone: form.phone,
        email: form.email,
        consultationFee: Number(form.consultationFee),
        workingHours: { start: form.start, end: form.end },
        availableDays: form.availableDays,
      });
      setDone(true);
      toast.success("Request submitted for verification");
    } catch (err) {
      toast.error(errMsg(err, "Submission failed"));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-amber-600">
          <Hourglass size={30} strokeWidth={2} />
        </div>
        <h1 className="font-display mt-3 text-xl font-bold">Pending verification</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your pathologist application is under review. An admin will verify it shortly.
        </p>
      </Card>
    );
  }

  const input = (k, label, props = {}) => (
    <Input label={label} value={form[k]} onChange={(e) => set(k, e.target.value)} {...props} />
  );

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold">List your lab on MediTrust</h1>
      <p className="mt-1 text-sm text-slate-500">Fill every field — an admin verifies your registration.</p>
      <Card className="mt-4">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {input("laboratoryName", "Laboratory name *")}
          {input("laboratoryAddress", "Laboratory address *")}
          {input("qualification", "Qualification *")}
          {input("registrationNumber", "Registration number *")}
          {input("experience", "Experience (years) *", { type: "number", min: 0 })}
          {input("specialization", "Specializations (comma separated) *")}
          {input("phone", "Phone *")}
          {input("email", "Email *", { type: "email" })}
          {input("consultationFee", "Base fee (₹) *", { type: "number", min: 0 })}
          <div className="grid grid-cols-2 gap-2">
            {input("start", "Opens *", { type: "time" })}
            {input("end", "Closes *", { type: "time" })}
          </div>
          <div className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Available days *</span>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`btn-press rounded-full px-3 py-1.5 text-xs font-bold ${form.availableDays.includes(d) ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="sm:col-span-2" disabled={loading}>
            {loading ? "Submitting…" : "Submit for verification"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
