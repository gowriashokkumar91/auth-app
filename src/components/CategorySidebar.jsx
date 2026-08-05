"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-secondary rounded-3xl p-5 shadow-sm border border-primary/10 sticky top-28">
        <h2 className="text-xl font-extrabold text-primary mb-4 pb-4 border-b border-primary/10">
          Categories
        </h2>
        <nav className="flex flex-col gap-2">
          {categoriesList.map((cat, index) => {
            const href = `/categories/${cat.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`;
            // Exact match or if we are at root /categories, we don't highlight anything unless it's a specific category
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
