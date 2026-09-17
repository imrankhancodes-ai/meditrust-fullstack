import { Link, useParams } from "react-router-dom";
import { useMyOrders, useOrder, useCancelOrder } from "../../hooks/useOrders";
import { Badge, Spinner, ErrorState, EmptyState, Card } from "../../components/ui/ui";

export function MyOrders() {
  const { data: orders, isLoading, isError, refetch } = useMyOrders();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load your orders." onRetry={() => refetch()} />;
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No orders yet"
        hint="Your placed orders will show up here with live status."
        action={
          <Link to="/shop" className="btn-press rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">My orders</h1>
      <div className="mt-4 space-y-3">
        {orders.map((o) => (
          <Link key={o._id} to={`/orders/${o._id}`} className="block rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-slate-400">{o._id}</span>
              <Badge tone={o.status}>{o.status}</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {o.items?.length} item(s) · <span className="font-extrabold text-slate-900">₹{o.totalAmount}</span>
              {" · "}{new Date(o.createdAt).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function OrderDetail() {
  const { oid } = useParams();
  const { data: order, isLoading, isError, refetch } = useOrder(oid);
  const cancel = useCancelOrder();

  if (isLoading) return <Spinner />;
  if (isError || !order) return <ErrorState message="Could not load this order." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/orders" className="text-sm font-semibold text-teal-700">← All orders</Link>
      <Card className="mt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-mono text-sm text-slate-500">{order._id}</h1>
          <Badge tone={order.status}>{order.status}</Badge>
        </div>
        <div className="mt-4 space-y-2">
          {(order.items || []).map((i, idx) => (
            <div key={idx} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <span>{i.name} × {i.quantity}</span>
              <span className="font-bold">₹{i.price * i.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 font-extrabold">
          <span>Total</span><span>₹{order.totalAmount}</span>
        </div>
        <p className="mt-3 text-sm text-slate-500">Delivering to: {order.shippingAddress}</p>
        <p className="text-sm text-slate-500">Payment: {order.paymentStatus}</p>
        {order.status === "placed" && (
          <button
            onClick={() => cancel.mutate(order._id)}
            disabled={cancel.isPending}
            className="btn-press mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            {cancel.isPending ? "Cancelling…" : "Cancel order"}
          </button>
        )}
      </Card>
    </div>
  );
}
