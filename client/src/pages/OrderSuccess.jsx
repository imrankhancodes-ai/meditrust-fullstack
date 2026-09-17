import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, PackageSearch, Store } from "lucide-react";
import { useOrder } from "../hooks/useOrders";
import { ErrorState, Badge } from "../components/ui/ui";
import BrandLoader from "../components/ui/BrandLoader";

export default function OrderSuccess() {
  const { oid } = useParams();
  const { data: order, isLoading, isError, refetch } = useOrder(oid);

  if (isLoading) return <BrandLoader label="Confirming your order…" />;
  if (isError || !order)
    return <ErrorState message="Could not load your order." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-xl text-center">
      <motion.div
        className="rounded-[2rem] border border-slate-100 bg-white p-10 shadow-[0_2px_16px_rgba(15,118,110,0.08)]"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
        >
          <CheckCircle2 size={52} strokeWidth={2} />
        </motion.div>
        <h1 className="font-display mt-4 text-3xl font-bold text-slate-900">Order placed!</h1>
        <p className="mt-1 text-sm text-slate-500">
          Order <span className="font-mono font-bold text-slate-700">{order._id}</span> is confirmed.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Badge tone={order.status}>{order.status}</Badge>
          <span className="font-display font-bold">₹{order.totalAmount}</span>
        </div>
        <p className="mt-3 text-sm text-slate-500">Delivering to: {order.shippingAddress}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={`/orders/${order._id}`} className="btn-press inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold hover:bg-slate-50">
            <PackageSearch size={15} strokeWidth={2.2} /> Track order
          </Link>
          <Link to="/shop" className="btn-press inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)]">
            <Store size={15} strokeWidth={2.2} /> Continue shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
