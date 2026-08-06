"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useSearchProductsQuery } from "@/redux/slices/product.slice";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data = [], isLoading: loading } = useSearchProductsQuery(query, {
    skip: !query,
  });

  // Map backend `_id` to `id` for frontend ProductCard compatibility
  const products = data.map((p) => ({ ...p, id: p._id || p.id }));

  return (
    <div>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
          Search Results
        </h1>
        <p className="text-primary/70">
          {query
            ? `Showing results for "${query}"`
            : "Please enter a search term"}
        </p>
      </div>

      {!query ? (
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <p className="text-lg font-medium text-center">Start searching</p>
          <p className="text-sm mt-1">
            Type in the search bar above to find products.
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-20 text-primary animate-pulse">
          <p className="text-xl font-bold">Searching...</p>
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
            No products found for "{query}".
          </p>
          <p className="text-sm mt-1">
            Try a different search term or browse our categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-slide-up">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8">
      <Suspense
        fallback={
          <div className="py-20 text-center font-bold animate-pulse">
            Loading search...
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
