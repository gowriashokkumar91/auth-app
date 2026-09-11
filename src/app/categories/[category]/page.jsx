"use client";

import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useGetProductsByCategoryQuery } from "@/redux/slices/product.slice";

export default function CategoryProductsPage() {
  const params = useParams();
  const categoryName = params.category;
  const title =
    categoryName.charAt(0).toUpperCase() +
    categoryName.slice(1).replace(/-/g, " ");

  const { data = [], isLoading: loading } =
    useGetProductsByCategoryQuery(categoryName);

  // Map backend `_id` to `id` for frontend ProductCard compatibility
  const products = data.map((p) => ({ ...p, id: p._id || p.id }));

  return (
    <div>
      <div className="mb-6 animate-fade-in relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm border border-accent/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
          </span>
          Farm Fresh
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 capitalize">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary to-accent drop-shadow-sm">
            {title}
          </span>
        </h1>
        <p className="text-sm md:text-base text-primary/70 font-medium max-w-xl leading-snug">
          Discover our curated selection of pristine, high-quality{" "}
          <span className="text-accent font-bold lowercase">{title}</span> —
          harvested at peak ripeness and delivered directly from our fields to
          your table.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-primary animate-pulse">
          <p className="text-xl font-bold">Loading {title.toLowerCase()}...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mb-4 text-zinc-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-lg font-medium text-center">
            No products found in this category.
          </p>
          <p className="text-sm mt-1">
            Check back later or browse other categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 animate-slide-up">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} simplified={true} />
          ))}
        </div>
      )}
    </div>
  );
}
