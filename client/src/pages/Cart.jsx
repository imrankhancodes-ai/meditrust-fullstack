import { Link, useNavigate } from "react-router-dom";
import { useCartQuery, useSetCartQty, useRemoveCartItem } from "../hooks/useCart";
import { CartLineItem, CartSummary } from "../components/cart/CartDrawer";
import { Spinner, ErrorState, EmptyState } from "../components/ui/ui";

export default function Cart() {
  const { data: cart, isLoading, isError, refetch } = useCartQuery();
  const setQty = useSetCartQty();
  const removeItem = useRemoveCartItem();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load your cart." onRetry={() => refetch()} />;

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        hint="Add medicines from the shop or straight from a prescription result."
        action={
          <Link to="/shop" className="btn-press rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">
            Browse medicines
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Your cart</h1>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.product?._id || i.product} className="rounded-2xl bg-white p-3 shadow-sm">
              <CartLineItem
                item={i}
                pending={setQty.isPending || removeItem.isPending}
                onQty={(q) => setQty.mutate({ productId: i.product._id, quantity: q })}
                onRemove={() => removeItem.mutate(i.product._id)}
              />
            </div>
          ))}
        </div>
        <CartSummary items={items} onCheckout={() => navigate("/checkout")} />
      </div>
    </div>
  );
}
