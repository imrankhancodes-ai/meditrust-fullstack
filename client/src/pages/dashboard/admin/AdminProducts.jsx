import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import adminService from "../../../services/adminService";
import { Spinner, ErrorState, EmptyState, Badge, Button } from "../../../components/ui/ui";

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

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load products." onRetry={() => refetch()} />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold">Products ({products?.length || 0})</h1>
        <Link to="/dashboard/admin/products/new" className="btn-press rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white">
          + Add product
        </Link>
      </div>
      {(!products || products.length === 0) ? (
        <div className="mt-4"><EmptyState icon="💊" title="No products" hint="Add your first product to the catalog." /></div>
      ) : (
        <div className="mt-4 space-y-3">
          {products.map((p) => (
            <div key={p._id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
              {p.image && <img src={p.image} alt={p.name} className="h-12 w-12 rounded-xl object-cover" />}
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
                <Link to={`/dashboard/admin/products/${p._id}/edit`} className="btn-press rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
                  Edit
                </Link>
                {p.isActive && (
                  <button
                    onClick={() => del.mutate(p._id)}
                    disabled={del.isPending}
                    className="btn-press rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700"
                  >
                    Deactivate
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
