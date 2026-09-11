"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const categoriesList = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Greens",
  "Pulses & Nuts",
  "Fodder",
  "Seeds",
];

export default function CategorySidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Find active category name to display in the mobile dropdown button
  const activeCategory =
    categoriesList.find(
      (cat) =>
        pathname ===
        `/categories/${cat.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`
    ) || "Select Category";

  return (
    <aside className="w-full md:w-64 flex-shrink-0 mb-4 md:mb-0 relative z-40">
      {/* ---------------- MOBILE DROPDOWN ---------------- */}
      <div className="md:hidden sticky top-[72px] sm:top-20 z-50">
        {/* Sleek Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <path d="M3 14h7v7H3z" />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-zinc-400 mb-0.5">
                Browse Categories
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-primary leading-none">
                {activeCategory}
              </h2>
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-emerald-600 text-white shadow-md" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </button>

        {/* Floating Dropdown Menu */}
        <div
          className={`absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-primary/10 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 origin-top ${isOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"}`}
        >
          <div className="p-2 flex flex-col gap-1 max-h-[50vh] overflow-y-auto custom-scrollbar">
            {categoriesList.map((cat, index) => {
              const href = `/categories/${cat.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={index}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-primary/70 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {cat}
                  {isActive && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-fade-in"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- DESKTOP SIDEBAR ---------------- */}
      <div className="hidden md:block bg-secondary rounded-3xl p-5 shadow-sm border border-primary/10 sticky top-28">
        <h2 className="text-xl font-extrabold text-primary mb-4 pb-4 border-b border-primary/10">
          Categories
        </h2>
        <nav className="flex flex-col gap-2">
          {categoriesList.map((cat, index) => {
            const href = `/categories/${cat.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`;
            const isActive = pathname === href;

            return (
              <Link
                key={index}
                href={href}
                className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20 translate-x-1"
                    : "text-primary/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
