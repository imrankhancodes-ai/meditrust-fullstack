import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCartDrawer, useCartQuery, useSetCartQty, useRemoveCartItem } from "../../hooks/useCart";

export function CartDrawer() {
  const { open, setOpen } = useCartDrawer();
  const { data: cart } = useCartQuery();
  const setQty = useSetCartQty();
  const removeItem = useRemoveCartItem();
  const navigate = useNavigate();

  if (!open) return null;
  const items = cart?.items || [];
  const total = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h3 className="font-bold text-slate-900">Your cart ({items.length})</h3>
          <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 nice-scroll">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">Your cart is empty. Browse the shop to add medicines.</p>
          ) : (
            <div className="space-y-3">
              {items.map((i) => (
                <CartLineItem
                  key={i.product?._id || i.product}
                  item={i}
                  onQty={(q) => setQty.mutate({ productId: i.product._id, quantity: q })}
                  onRemove={() => removeItem.mutate(i.product._id)}
                  pending={setQty.isPending || removeItem.isPending}
                />
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-slate-100 p-4">
            <div className="mb-3 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/checkout");
              }}
              className="btn-press w-full rounded-xl bg-teal-700 py-3 text-sm font-bold text-white hover:bg-teal-800"
            >
              Proceed to checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export function CartLineItem({ item, onQty, onRemove, pending }) {
  const p = item.product || {};
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-100 p-3">
      {p.image ? (
        <img src={p.image} alt={p.name} className="h-16 w-16 rounded-xl object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-2xl">💊</div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-slate-900">{p.name}</div>
        <div className="text-sm font-semibold text-teal-800">₹{p.price}</div>
        <div className="mt-1.5 flex items-center gap-2">
          <button
            disabled={pending}
            onClick={() => onQty(Math.max(0, item.quantity - 1))}
            className="rounded-lg bg-slate-100 p-1.5 hover:bg-slate-200 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-6 text-center text-sm font-bold">{item.quantity}</span>
          <button
            disabled={pending || (p.stock != null && item.quantity >= p.stock)}
            onClick={() => onQty(item.quantity + 1)}
            className="rounded-lg bg-slate-100 p-1.5 hover:bg-slate-200 disabled:opacity-50"
            aria-label="Increase quantity"
            title={p.stock != null ? `Max ${p.stock} in stock` : ""}
          >
            <Plus size={14} />
          </button>
          <button
            onClick={onRemove}
            disabled={pending}
            className="ml-auto rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartSummary({ items, onCheckout }) {
  const total = (items || []).reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const count = (items || []).reduce((s, i) => s + i.quantity, 0);
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
      <h3 className="font-bold text-slate-900">Order summary</h3>
      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
        <div className="flex justify-between"><span>Items</span><span>{count}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span className="text-emerald-700 font-semibold">Free</span></div>
        <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-extrabold text-slate-900">
          <span>Total</span><span>₹{total}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        className="btn-press mt-4 w-full rounded-xl bg-teal-700 py-3 text-sm font-bold text-white hover:bg-teal-800"
      >
        Proceed to checkout
      </button>
    </div>
  );
}

// keep cart badge hydrated
export function useCartBadge() {
  return useSelector((s) => s.cart);
}
