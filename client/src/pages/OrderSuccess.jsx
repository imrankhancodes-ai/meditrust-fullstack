import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useOrder } from "../hooks/useOrders";
import { Spinner, ErrorState, Badge } from "../components/ui/ui";

export default function OrderSuccess() {
  const { oid } = useParams();
  const { data: order, isLoading, isError, refetch } = useOrder(oid);

  if (isLoading) return <Spinner />;
  if (isError || !order)
    return <ErrorState message="Could not load your order." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="rounded-3xl bg-white p-10 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
        <CheckCircle2 size={56} className="mx-auto text-emerald-600" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Order placed!</h1>
        <p className="mt-1 text-sm text-slate-500">
          Order <span className="font-mono font-bold text-slate-700">{order._id}</span> is confirmed.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Badge tone={order.status}>{order.status}</Badge>
          <span className="font-extrabold">₹{order.totalAmount}</span>
        </div>
        <p className="mt-3 text-sm text-slate-500">Delivering to: {order.shippingAddress}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to={`/orders/${order._id}`} className="btn-press rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold">
            Track order
          </Link>
          <Link to="/shop" className="btn-press rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
