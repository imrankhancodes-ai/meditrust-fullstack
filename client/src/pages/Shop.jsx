import { useState } from "react";
import { Search } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid, CategoryFilter } from "../components/product/ProductCard";
import { Skeletons, ErrorState, EmptyState } from "../components/ui/ui";

const CATEGORIES = ["Tablet", "Syrup", "Injection", "Device", "Capsule", "Powder", "Ointment", "General"];

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
      <h1 className="text-2xl font-extrabold text-slate-900">Medicine shop</h1>
      <p className="mt-1 text-sm text-slate-500">Live stock & prices — alternatives shown for the same composition.</p>

      <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by name, salt, company…"
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">Sort: featured</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
            <option value="name">Name A–Z</option>
          </select>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
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

      <div className="mt-6">
        {isLoading ? (
          <Skeletons count={8} />
        ) : isError ? (
          <ErrorState message="Could not load products." onRetry={() => refetch()} />
        ) : !products || products.length === 0 ? (
          <EmptyState
            icon="🔍"
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
                className="btn-press rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            <p className="mb-3 text-sm text-slate-500">{products.length} product(s)</p>
            <ProductGrid products={products} />
          </>
        )}
      </div>
    </div>
  );
}
