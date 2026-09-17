import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, X, Pill, ShoppingBag } from "lucide-react";
import { useCartDrawer, useCartQuery, useSetCartQty, useRemoveCartItem } from "../../hooks/useCart";

export function CartDrawer() {
  const { open, setOpen } = useCartDrawer();
  const { data: cart } = useCartQuery();
  const setQty = useSetCartQty();
  const removeItem = useRemoveCartItem();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const total = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            className="absolute bottom-0 right-0 top-0 flex h-full w-full flex-col bg-white shadow-2xl sm:bottom-auto sm:h-full sm:max-w-md sm:rounded-l-[2rem] max-sm:rounded-t-[2rem] max-sm:top-12"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h3 className="font-display flex items-center gap-2 font-bold text-slate-900">
                <ShoppingBag size={18} strokeWidth={2.2} className="text-teal-700" />
                Your cart ({items.length})
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="touch-44 flex items-center justify-center rounded-full p-2.5 hover:bg-slate-100"
                aria-label="Close cart"
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 nice-scroll">
              {items.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-600">
                    <ShoppingBag size={28} strokeWidth={2} />
                  </span>
                  <p className="mt-3 text-sm text-slate-500">Your cart is empty. Browse the shop to add medicines.</p>
                </div>
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
              <div className="pb-safe border-t border-slate-100 p-4">
                <div className="mb-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="font-display">₹{total}</span>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/checkout");
                  }}
                  className="btn-press w-full rounded-full bg-teal-700 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(17,94,89,0.4)] hover:bg-teal-800"
                >
                  Proceed to checkout
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export function CartLineItem({ item, onQty, onRemove, pending }) {
  const p = item.product || {};
  return (
    <div className="flex gap-3 rounded-3xl border border-slate-100 p-3">
      {p.image ? (
        <img src={p.image} alt={p.name} className="h-16 w-16 rounded-2xl object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
          <Pill size={26} strokeWidth={1.8} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-slate-900">{p.name}</div>
        <div className="font-display text-sm font-bold text-teal-800">₹{p.price}</div>
        <div className="mt-1.5 flex items-center gap-2">
          <button
            disabled={pending}
            onClick={() => onQty(Math.max(0, item.quantity - 1))}
            className="touch-44 flex items-center justify-center rounded-full bg-slate-100 p-2 hover:bg-slate-200 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus size={14} strokeWidth={2.4} />
          </button>
          <span className="min-w-6 text-center text-sm font-bold">{item.quantity}</span>
          <button
            disabled={pending || (p.stock != null && item.quantity >= p.stock)}
            onClick={() => onQty(item.quantity + 1)}
            className="touch-44 flex items-center justify-center rounded-full bg-slate-100 p-2 hover:bg-slate-200 disabled:opacity-50"
            aria-label="Increase quantity"
            title={p.stock != null ? `Max ${p.stock} in stock` : ""}
          >
            <Plus size={14} strokeWidth={2.4} />
          </button>
          <button
            onClick={onRemove}
            disabled={pending}
            className="touch-44 ml-auto flex items-center justify-center rounded-full p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 size={16} strokeWidth={2.2} />
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
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
      <h3 className="font-display font-bold text-slate-900">Order summary</h3>
      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
        <div className="flex justify-between"><span>Items</span><span>{count}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span className="text-emerald-700 font-semibold">Free</span></div>
        <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-extrabold text-slate-900">
          <span>Total</span><span className="font-display">₹{total}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        className="btn-press mt-4 w-full rounded-full bg-teal-700 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(17,94,89,0.4)] hover:bg-teal-800"
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
