import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import pathologistService from "../../../services/pathologistService";
import { Input, Button, Card, Spinner, ErrorState, EmptyState } from "../../../components/ui/ui";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function PathologistTests() {
  const qc = useQueryClient();
  const { data: tests, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-tests"],
    queryFn: pathologistService.tests,
  });
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [editing, setEditing] = useState(null);

  const add = useMutation({
    mutationFn: pathologistService.addTest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-tests"] });
      qc.invalidateQueries({ queryKey: ["pathology-tests"] });
      setForm({ title: "", description: "", price: "" });
      toast.success("Test added");
    },
    onError: (err) => toast.error(errMsg(err, "Could not add test")),
  });

  const update = useMutation({
    mutationFn: ({ tid, payload }) => pathologistService.updateTest(tid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-tests"] });
      qc.invalidateQueries({ queryKey: ["pathology-tests"] });
      setEditing(null);
      toast.success("Test updated");
    },
    onError: (err) => toast.error(errMsg(err, "Update failed")),
  });

  const remove = useMutation({
    mutationFn: (tid) => pathologistService.deleteTest(tid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-tests"] });
      qc.invalidateQueries({ queryKey: ["pathology-tests"] });
      toast.success("Test deleted");
    },
    onError: (err) => toast.error(errMsg(err, "Delete failed")),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load tests." onRetry={() => refetch()} />;

  return (
    <div>
      <h1 className="text-xl font-extrabold">My test catalog</h1>

      <Card className="mt-4">
        <h3 className="font-bold">{editing ? "Edit test" : "Add a test"}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const payload = { title: form.title, description: form.description, price: Number(form.price) };
            if (editing) update.mutate({ tid: editing, payload });
            else add.mutate(payload);
          }}
          className="mt-3 grid gap-3 sm:grid-cols-3"
        >
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Price (₹) *" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <div className="flex gap-2 sm:col-span-3">
            <Button type="submit" disabled={add.isPending || update.isPending}>
              {editing ? "Save changes" : "Add test"}
            </Button>
            {editing && (
              <Button variant="outline" type="button" onClick={() => { setEditing(null); setForm({ title: "", description: "", price: "" }); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="mt-4 space-y-3">
        {(!tests || tests.length === 0) && (
          <EmptyState icon="🧪" title="No tests yet" hint="Add your first diagnostic test above." />
        )}
        {(tests || []).map((t) => (
          <div key={t._id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <div>
              <div className="font-bold">{t.title}</div>
              <div className="text-sm text-slate-500">{t.description} · ₹{t.price}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(t._id); setForm({ title: t.title, description: t.description, price: t.price }); }}
                className="btn-press rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800"
              >
                Edit
              </button>
              <button
                onClick={() => remove.mutate(t._id)}
                disabled={remove.isPending}
                className="btn-press rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
