import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import adminService from "../../../services/adminService";
import { Input, Button, Card, Spinner } from "../../../components/ui/ui";

const CATEGORIES = ["Tablet", "Syrup", "Injection", "Device", "Capsule", "Powder", "Ointment", "General"];

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function AdminProductForm() {
  const { pid } = useParams();
  const isEdit = !!pid;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminService.products,
    enabled: isEdit,
  });
  const existing = isEdit ? (products || []).find((p) => p._id === pid) : null;

  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", expiresOn: "",
    genericName: "", company: "", category: "Tablet", requiresPrescription: false,
  });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || "",
        description: existing.description || "",
        price: existing.price || "",
        stock: existing.stock || "",
        expiresOn: existing.expiresOn || "",
        genericName: existing.genericName || "",
        company: existing.company || "",
        category: existing.category || "Tablet",
        requiresPrescription: !!existing.requiresPrescription,
      });
    }
  }, [existing]);

  if (isEdit && isLoading) return <Spinner />;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await adminService.updateProduct(pid, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
        toast.success("Product updated");
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (image) fd.append("image", image);
        else {
          toast.error("Product image is required");
          setSaving(false);
          return;
        }
        await adminService.addProduct(fd);
        toast.success("Product created");
      }
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      navigate("/dashboard/admin/products");
    } catch (err) {
      toast.error(errMsg(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-extrabold">{isEdit ? "Edit product" : "Add product"}</h1>
      <Card className="mt-4">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Name *" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <Input label="Company *" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Cipla" />
          <Input label="Generic / salt composition *" value={form.genericName} onChange={(e) => set("genericName", e.target.value)} placeholder="Paracetamol" />
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Category *</span>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <Input label="Price (₹) *" type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} />
          <Input label="Stock *" type="number" min={0} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
          <Input label="Expires on *" type="date" value={form.expiresOn} onChange={(e) => set("expiresOn", e.target.value)} />
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.requiresPrescription} onChange={(e) => set("requiresPrescription", e.target.checked)} className="h-4 w-4 accent-teal-700" />
            Requires prescription
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Description *</span>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
          </label>
          {!isEdit && (
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">Product image *</span>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0])} className="text-sm" />
            </label>
          )}
          <Button type="submit" className="sm:col-span-2" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
