import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Pill } from "lucide-react";
import { Badge } from "../ui/ui";
import { useAddToCart } from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import { StaggerGroup, StaggerItem } from "../motion/Stagger";

export function ProductCard({ product }) {
  const addMutation = useAddToCart();
  const { isLoggedIn } = useAuth();
  const out = product.stock === 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_2px_16px_rgba(15,118,110,0.08)] hover:shadow-[0_12px_36px_rgba(15,118,110,0.18)]"
    >
      <Link to={`/product/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Pill size={44} strokeWidth={1.6} />
          </div>
        )}
        {out && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
            Out of stock
          </span>
        )}
        {product.requiresPrescription && (
          <span className="absolute right-2 top-2 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            Rx needed
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-xs font-medium text-teal-700">
          {product.genericName} · {product.company}
        </div>
        <Link
          to={`/product/${product._id}`}
          className="mt-0.5 font-bold leading-snug text-slate-900 hover:text-teal-800"
        >
          {product.name}
        </Link>
        <div className="mt-1 text-xs text-slate-500">{product.category}</div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-slate-900">₹{product.price}</span>
          {product.stock > 0 && product.stock <= 10 && (
            <Badge tone="medium">Only {product.stock} left</Badge>
          )}
        </div>
        <button
          disabled={out || addMutation.isPending || !isLoggedIn}
          onClick={() => addMutation.mutate({ productId: product._id, quantity: 1 })}
          title={!isLoggedIn ? "Log in to add to cart" : ""}
          className="btn-press mt-3 flex items-center justify-center gap-1.5 rounded-full bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(17,94,89,0.3)] hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {out ? (
            "Out of stock"
          ) : (
            <>
              <ShoppingCart size={16} strokeWidth={2.2} /> {addMutation.isPending ? "Adding…" : "Add to cart"}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export function ProductGrid({ products }) {
  return (
    <StaggerGroup className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <StaggerItem key={p._id} className="h-full">
          <ProductCard product={p} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}

export function AlternativesRow({ alternatives }) {
  if (!alternatives || alternatives.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No alternative brands with the same composition in stock right now.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {alternatives.map((p) => (
        <div key={p._id} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm">
          {p.image ? (
            <img src={p.image} alt={p.name} className="h-14 w-14 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
              <Pill size={24} strokeWidth={1.8} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Link to={`/product/${p._id}`} className="block truncate text-sm font-bold hover:text-teal-800">
              {p.name}
            </Link>
            <div className="text-xs text-slate-500">{p.company}</div>
            <div className="font-display text-sm font-bold">₹{p.price}</div>
          </div>
          <AddButton productId={p._id} />
        </div>
      ))}
    </div>
  );
}

function AddButton({ productId }) {
  const m = useAddToCart();
  const { isLoggedIn } = useAuth();
  return (
    <button
      disabled={m.isPending || !isLoggedIn}
      onClick={() => m.mutate({ productId, quantity: 1 })}
      className="btn-press touch-44 flex items-center justify-center rounded-full bg-teal-50 p-2.5 text-teal-800 hover:bg-teal-100 disabled:opacity-50"
      aria-label="Add alternative to cart"
    >
      <Plus size={18} strokeWidth={2.4} />
    </button>
  );
}

export function CategoryFilter({ value, onChange, categories }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={`btn-press rounded-full px-4 py-2 text-sm font-semibold transition ${
          !value ? "bg-teal-700 text-white shadow-[0_4px_14px_rgba(17,94,89,0.3)]" : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50"
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(value === c ? "" : c)}
          className={`btn-press rounded-full px-4 py-2 text-sm font-semibold transition ${
            value === c ? "bg-teal-700 text-white shadow-[0_4px_14px_rgba(17,94,89,0.3)]" : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
