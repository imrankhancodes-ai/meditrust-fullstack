import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { MapPin, Banknote } from "lucide-react";
import { useCartQuery } from "../hooks/useCart";
import { usePlaceOrder } from "../hooks/useOrders";
import { syncFromServer } from "../redux/slices/cartSlice";
import { Button, Card, ErrorState, EmptyState } from "../components/ui/ui";
import { OrderListSkeleton } from "../components/ui/Skeletons";
import SectionHeading from "../components/ui/SectionHeading";
import { ShoppingCart } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function Checkout() {
  const { data: cart, isLoading, isError, refetch } = useCartQuery();
  const { profile } = useAuth();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const place = usePlaceOrder();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) return <OrderListSkeleton count={3} />;
  if (isError) return <ErrorState message="Could not load your cart." onRetry={() => refetch()} />;

  const items = cart?.items || [];
  const total = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);

  if (items.length === 0) {
    return <EmptyState icon={<ShoppingCart size={30} strokeWidth={2} />} title="Nothing to check out" hint="Your cart is empty." />;
  }

  const submit = (e) => {
    e.preventDefault();
    const addr = address.trim() || profile?.address || "";
    if (!addr) {
      setError("Shipping address is required");
      return;
    }
    setError("");
    place.mutate(
      { shippingAddress: addr },
      {
        onSuccess: (order) => {
          dispatch(syncFromServer({ items: [] }));
          toast.success("Order placed successfully!");
          navigate(`/order-success/${order._id}`);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeading eyebrow="Almost done" title="Checkout" sub="Confirm your address and place the order." />
      <div className="mt-4 grid gap-5 md:grid-cols-[1fr_300px]">
        <Card>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <MapPin size={15} strokeWidth={2.2} className="text-teal-700" /> Shipping address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                placeholder={profile?.address || "House no, street, city, PIN…"}
                className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
              {profile?.address && !address && (
                <p className="mt-1 text-xs text-slate-500">Saved address will be used if left blank: {profile.address}</p>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
              <Banknote size={17} strokeWidth={2.2} className="text-teal-700" />
              Payment: <span className="font-bold">Cash on delivery</span>
              <span className="text-xs text-slate-400">(online payments coming soon)</span>
            </div>
            <Button type="submit" className="w-full" disabled={place.isPending}>
              {place.isPending ? "Placing order…" : `Place order · ₹${total}`}
            </Button>
          </form>
        </Card>
        <Card>
          <h3 className="font-display font-bold">Items ({items.length})</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.product?._id} className="flex justify-between gap-2">
                <span className="text-slate-600">{i.product?.name} × {i.quantity}</span>
                <span className="font-bold">₹{(i.product?.price || 0) * i.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="font-display mt-3 flex justify-between border-t border-slate-100 pt-2 font-bold">
            <span>Total</span><span>₹{total}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
