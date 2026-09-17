import { useState } from "react";
import { Search, SearchX } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid, CategoryFilter } from "../components/product/ProductCard";
import { ErrorState, EmptyState } from "../components/ui/ui";
import { ProductGridSkeleton } from "../components/ui/Skeletons";
import SectionHeading from "../components/ui/SectionHeading";
import GradientMesh from "../components/ui/GradientMesh";
import Reveal from "../components/motion/Reveal";

const CATEGORIES = ["Tablet", "Syrup", "Capsule", "Sachet", "Cream", "Injection", "Device", "Consumable", "General"];

export default function Shop() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const params = {
    ...(debounced ? { search: debounced } : {}),
    ...(category ? { category } : {}),
    ...(sort ? { sort } : {}),
    ...(maxPrice ? { maxPrice } : {}),
  };

  const { data: products, isLoading, isError, refetch } = useProducts(params);

  const onSearch = (v) => {
    setSearch(v);
    clearTimeout(onSearch.t);
    onSearch.t = setTimeout(() => setDebounced(v), 400);
  };

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white px-6 py-8 shadow-[0_2px_16px_rgba(15,118,110,0.08)] sm:px-8">
        <GradientMesh />
        <div className="relative">
          <SectionHeading
            eyebrow="Pharmacy"
            title="Medicine shop"
            sub="Live stock & prices — alternatives shown for the same composition."
          />
          <div className="mt-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search size={17} strokeWidth={2.2} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search by name, salt, company…"
                  className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-teal-600 focus:outline-none"
              >
                <option value="">Sort: featured</option>
                <option value="price_asc">Price: low → high</option>
                <option value="price_desc">Price: high → low</option>
                <option value="name">Name A–Z</option>
              </select>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-teal-600 focus:outline-none"
              >
                <option value="">Any price</option>
                <option value="100">Under ₹100</option>
                <option value="300">Under ₹300</option>
                <option value="1000">Under ₹1000</option>
              </select>
            </div>
            <div className="mt-3">
              <CategoryFilter value={category} onChange={setCategory} categories={CATEGORIES} />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6">
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : isError ? (
          <ErrorState message="Could not load products." onRetry={() => refetch()} />
        ) : !products || products.length === 0 ? (
          <EmptyState
            icon={<SearchX size={30} strokeWidth={2} />}
            title="No medicines match your search"
            hint="Try a different name, salt or company — or clear the filters."
            action={
              <button
                onClick={() => {
                  setSearch("");
                  setDebounced("");
                  setCategory("");
                  setSort("");
                  setMaxPrice("");
                }}
                className="btn-press rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)]"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <Reveal>
            <p className="mb-3 text-sm text-slate-500">{products.length} product(s)</p>
            <ProductGrid products={products} />
          </Reveal>
        )}
      </div>
    </div>
  );
}
