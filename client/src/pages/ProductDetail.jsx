import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Pill, ShieldCheck } from "lucide-react";
import { useProduct, useAlternatives } from "../hooks/useProducts";
import { useAddToCart } from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import { AlternativesRow } from "../components/product/ProductCard";
import { Badge, ErrorState } from "../components/ui/ui";
import { ListSkeletonShaped } from "../components/ui/Skeletons";
import Reveal from "../components/motion/Reveal";
import BrandLoader from "../components/ui/BrandLoader";

export default function ProductDetail() {
  const { pid } = useParams();
  const { data: product, isLoading, isError, refetch } = useProduct(pid);
  const { data: alternatives, isLoading: altLoading } = useAlternatives(pid);
  const add = useAddToCart();
  const { isLoggedIn } = useAuth();

  if (isLoading) return <BrandLoader label="Loading medicine…" />;
  if (isError || !product)
    return <ErrorState message="Could not load this product." onRetry={() => refetch()} />;

  const out = product.stock === 0;

  return (
    <div>
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800">
        <ArrowLeft size={15} strokeWidth={2.4} /> Back to shop
      </Link>

      <div className="mt-3 grid gap-6 lg:grid-cols-2">
        <Reveal className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
          {product.image ? (
            <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-slate-200">
              <Pill size={96} strokeWidth={1.2} />
            </div>
          )}
        </Reveal>

        <Reveal delay={0.08} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_2px_16px_rgba(15,118,110,0.08)] sm:p-8">
          <div className="text-sm font-medium text-teal-700">
            {product.genericName} · {product.company} · {product.category}
          </div>
          <h1 className="font-display mt-1 text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-2 leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-display text-3xl font-bold text-slate-900">₹{product.price}</span>
            {out ? (
              <Badge tone="cancelled">Out of stock</Badge>
            ) : product.stock <= 10 ? (
              <Badge tone="medium">Only {product.stock} left</Badge>
            ) : (
              <Badge tone="delivered">In stock</Badge>
            )}
            {product.requiresPrescription && <Badge tone="default">Requires prescription</Badge>}
          </div>

          <button
            disabled={out || add.isPending || !isLoggedIn}
            onClick={() => add.mutate({ productId: product._id, quantity: 1 })}
            title={!isLoggedIn ? "Log in to add to cart" : ""}
            className="btn-press mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(17,94,89,0.4)] hover:bg-teal-800 disabled:bg-slate-300 disabled:shadow-none"
          >
            <ShoppingCart size={17} strokeWidth={2.2} /> {out ? "Out of stock" : add.isPending ? "Adding…" : "Add to cart"}
          </button>
          {!isLoggedIn && (
            <p className="mt-2 text-center text-xs text-slate-500">
              <Link to="/login" className="font-bold text-teal-700">Log in</Link> to add items to your cart.
            </p>
          )}

          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={13} strokeWidth={2.2} /> Genuine stock, pharmacist-reviewed catalog
          </p>

          <dl className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Company</dt><dd className="font-semibold">{product.company}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Composition</dt><dd className="font-semibold">{product.genericName}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd className="font-semibold">{product.category}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Expires</dt><dd className="font-semibold">{product.expiresOn}</dd></div>
          </dl>
        </Reveal>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-slate-900">Alternative brands</h2>
        <p className="mb-3 text-sm text-slate-500">
          Same composition ({product.genericName}) from other companies — never locked into one brand.
        </p>
        {altLoading ? (
          <ListSkeletonShaped count={3} />
        ) : (
          <AlternativesRow alternatives={alternatives} />
        )}
      </section>
    </div>
  );
}
