import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Pill, Pencil, Ban } from "lucide-react";
import adminService from "../../../services/adminService";
import { ErrorState, EmptyState, Badge, Button } from "../../../components/ui/ui";
import { ListSkeletonShaped } from "../../../components/ui/Skeletons";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function AdminProducts() {
  const qc = useQueryClient();
  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminService.products,
  });

  const del = useMutation({
    mutationFn: (pid) => adminService.deleteProduct(pid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deactivated");
    },
    onError: (err) => toast.error(errMsg(err, "Delete failed")),
  });

  if (isLoading) return <ListSkeletonShaped count={6} />;
  if (isError) return <ErrorState message="Could not load products." onRetry={() => refetch()} />;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold">Products ({products?.length || 0})</h1>
        <Link to="/dashboard/admin/products/new" className="btn-press inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-ink-800">
          <Plus size={15} strokeWidth={2.6} /> Add product
        </Link>
      </div>
      {(!products || products.length === 0) ? (
        <div className="mt-4"><EmptyState icon={<Pill size={30} strokeWidth={2} />} title="No products" hint="Add your first product to the catalog." /></div>
      ) : (
        <div className="mt-4 space-y-3">
          {products.map((p) => (
            <div key={p._id} className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-12 w-12 rounded-2xl object-cover" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                  <Pill size={22} strokeWidth={1.8} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-bold">{p.name}</div>
                <div className="text-xs text-slate-500">
                  {p.genericName} · {p.company} · {p.category} · ₹{p.price} · stock {p.stock}
                </div>
                <div className="mt-1 flex gap-1">
                  <Badge tone={p.isActive ? "delivered" : "cancelled"}>{p.isActive ? "active" : "inactive"}</Badge>
                  {p.requiresPrescription && <Badge>Rx</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/dashboard/admin/products/${p._id}/edit`} className="btn-press inline-flex items-center gap-1 rounded-full bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800">
                  <Pencil size={12} strokeWidth={2.4} /> Edit
                </Link>
                {p.isActive && (
                  <button
                    onClick={() => del.mutate(p._id)}
                    disabled={del.isPending}
                    className="btn-press inline-flex items-center gap-1 rounded-full bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700"
                  >
                    <Ban size={12} strokeWidth={2.4} /> Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminProductDeleteButton() {
  return <Button variant="danger">Delete</Button>;
}
