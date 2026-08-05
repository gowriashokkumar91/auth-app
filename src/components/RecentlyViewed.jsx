"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function RecentlyViewed() {
  const [mounted, setMounted] = useState(false);
  const recentlyViewedItems = useSelector(
    (state) => state.recentlyViewed?.items || []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || recentlyViewedItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-8 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="w-full">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Recently Viewed
            </h2>
            <p className="text-sm text-primary/60 font-medium mt-1">
              Pick up right where you left off
            </p>
          </div>
          <Link
            href="/categories"
            className="text-accent hover:text-accent/80 font-bold text-sm flex items-center gap-1 group transition-colors"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="flex gap-4 sm:gap-5 overflow-hidden">
          {recentlyViewedItems.slice(0, 8).map((product, idx) => (
            <div
              key={`${product.id || product._id || "rv"}-${idx}`}
              className="min-w-[120px] sm:min-w-[150px] max-w-[120px] sm:max-w-[150px] flex-shrink-0 snap-start group cursor-pointer flex flex-col"
              title={product.name}
            >
              <div className="w-full aspect-square bg-primary/5 rounded-2xl shadow-sm hover:shadow-md hover:shadow-primary/10 transition-all duration-300 border border-primary/10 overflow-hidden relative mb-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 120px, 150px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <h4 className="text-primary font-bold text-[11px] sm:text-xs truncate w-full text-center group-hover:text-accent transition-colors">
                {product.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
