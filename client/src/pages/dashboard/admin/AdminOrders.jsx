import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import adminService from "../../../services/adminService";
import { Spinner, ErrorState, EmptyState, Badge } from "../../../components/ui/ui";

const STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: adminService.orders,
  });

  const update = useMutation({
    mutationFn: ({ oid, status }) => adminService.updateOrderStatus(oid, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: (err) => toast.error(errMsg(err, "Update failed")),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load orders." onRetry={() => refetch()} />;
  if (!orders || orders.length === 0) return <EmptyState icon="📦" title="No orders yet" />;

  return (
    <div>
      <h1 className="text-xl font-extrabold">Orders ({orders.length})</h1>
      <div className="mt-4 space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-slate-400">{o._id}</span>
              <Badge tone={o.status}>{o.status}</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {o.user?.name} ({o.user?.email}) · {o.items?.length} item(s) ·{" "}
              <span className="font-extrabold text-slate-900">₹{o.totalAmount}</span> ·{" "}
              {new Date(o.createdAt).toLocaleString()}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={update.isPending || o.status === s}
                  onClick={() => update.mutate({ oid: o._id, status: s })}
                  className={`btn-press rounded-lg px-2.5 py-1 text-xs font-bold ${o.status === s ? "bg-slate-200 text-slate-500" : "bg-teal-50 text-teal-800 hover:bg-teal-100"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
