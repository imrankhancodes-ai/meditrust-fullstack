import { Link } from "react-router-dom";
import { ShoppingCart, Plus } from "lucide-react";
import { Badge } from "../ui/ui";
import { useAddToCart } from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";

export function ProductCard({ product }) {
  const addMutation = useAddToCart();
  const { isLoggedIn } = useAuth();
  const out = product.stock === 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(15,118,110,0.08)] transition hover:shadow-[0_8px_30px_rgba(15,118,110,0.15)]">
      <Link to={`/product/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">💊</div>
        )}
        {out && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
            Out of stock
          </span>
        )}
        {product.requiresPrescription && (
          <span className="absolute right-2 top-2 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white">
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
          <span className="text-lg font-extrabold text-slate-900">₹{product.price}</span>
          {product.stock > 0 && product.stock <= 10 && (
            <Badge tone="medium">Only {product.stock} left</Badge>
          )}
        </div>
        <button
          disabled={out || addMutation.isPending || !isLoggedIn}
          onClick={() => addMutation.mutate({ productId: product._id, quantity: 1 })}
          title={!isLoggedIn ? "Log in to add to cart" : ""}
          className="btn-press mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {out ? (
            "Out of stock"
          ) : (
            <>
              <ShoppingCart size={16} /> {addMutation.isPending ? "Adding…" : "Add to cart"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
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
        <div key={p._id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
          {p.image ? (
            <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">💊</div>
          )}
          <div className="min-w-0 flex-1">
            <Link to={`/product/${p._id}`} className="block truncate text-sm font-bold hover:text-teal-800">
              {p.name}
            </Link>
            <div className="text-xs text-slate-500">{p.company}</div>
            <div className="text-sm font-extrabold">₹{p.price}</div>
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
      className="btn-press rounded-xl bg-teal-50 p-2.5 text-teal-800 hover:bg-teal-100 disabled:opacity-50"
      aria-label="Add alternative to cart"
    >
      <Plus size={18} />
    </button>
  );
}

export function CategoryFilter({ value, onChange, categories }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={`btn-press rounded-full px-4 py-1.5 text-sm font-semibold ${
          !value ? "bg-teal-700 text-white" : "bg-white text-slate-600 shadow-sm hover:bg-teal-50"
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(value === c ? "" : c)}
          className={`btn-press rounded-full px-4 py-1.5 text-sm font-semibold ${
            value === c ? "bg-teal-700 text-white" : "bg-white text-slate-600 shadow-sm hover:bg-teal-50"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
