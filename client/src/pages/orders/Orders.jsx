import { Link, useParams } from "react-router-dom";
import { Package, CalendarClock, ArrowLeft, XCircle } from "lucide-react";
import { useMyOrders, useOrder, useCancelOrder } from "../../hooks/useOrders";
import { Badge, ErrorState, EmptyState, Card } from "../../components/ui/ui";
import { OrderListSkeleton } from "../../components/ui/Skeletons";
import SectionHeading from "../../components/ui/SectionHeading";
import BrandLoader from "../../components/ui/BrandLoader";
import { StaggerGroup, StaggerItem } from "../../components/motion/Stagger";

export function MyOrders() {
  const { data: orders, isLoading, isError, refetch } = useMyOrders();

  if (isLoading) return <OrderListSkeleton count={4} />;
  if (isError) return <ErrorState message="Could not load your orders." onRetry={() => refetch()} />;
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={<Package size={30} strokeWidth={2} />}
        title="No orders yet"
        hint="Your placed orders will show up here with live status."
        action={
          <Link to="/shop" className="btn-press rounded-full bg-teal-700 px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)]">
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <SectionHeading eyebrow="Purchases" title="My orders" sub="Track every order with live status." />
      <StaggerGroup className="mt-4 space-y-3">
        {orders.map((o) => (
          <StaggerItem key={o._id}>
            <Link to={`/orders/${o._id}`} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Package size={20} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-xs text-slate-400">{o._id}</span>
                <span className="mt-0.5 block text-sm text-slate-600">
                  {o.items?.length} item(s) · <span className="font-display font-bold text-slate-900">₹{o.totalAmount}</span>
                  {" · "}{new Date(o.createdAt).toLocaleString()}
                </span>
              </span>
              <Badge tone={o.status}>{o.status}</Badge>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}

export function OrderDetail() {
  const { oid } = useParams();
  const { data: order, isLoading, isError, refetch } = useOrder(oid);
  const cancel = useCancelOrder();

  if (isLoading) return <BrandLoader label="Loading order…" />;
  if (isError || !order) return <ErrorState message="Could not load this order." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
        <ArrowLeft size={15} strokeWidth={2.4} /> All orders
      </Link>
      <Card className="mt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-mono text-sm text-slate-500">{order._id}</h1>
          <Badge tone={order.status}>{order.status}</Badge>
        </div>
        <div className="mt-4 space-y-2">
          {(order.items || []).map((i, idx) => (
            <div key={idx} className="flex justify-between rounded-2xl bg-slate-50 px-3.5 py-2.5 text-sm">
              <span>{i.name} × {i.quantity}</span>
              <span className="font-display font-bold">₹{i.price * i.quantity}</span>
            </div>
          ))}
        </div>
        <div className="font-display mt-3 flex justify-between border-t border-slate-100 pt-3 font-bold">
          <span>Total</span><span>₹{order.totalAmount}</span>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
          <CalendarClock size={14} strokeWidth={2.2} className="text-slate-400" />
          Delivering to: {order.shippingAddress}
        </p>
        <p className="text-sm text-slate-500">Payment: {order.paymentStatus}</p>
        {order.status === "placed" && (
          <button
            onClick={() => cancel.mutate(order._id)}
            disabled={cancel.isPending}
            className="btn-press mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            <XCircle size={15} strokeWidth={2.2} /> {cancel.isPending ? "Cancelling…" : "Cancel order"}
          </button>
        )}
      </Card>
    </div>
  );
}
