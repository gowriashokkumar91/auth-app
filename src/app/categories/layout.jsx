import CategorySidebar from "@/components/CategorySidebar";

export const metadata = {
  title: "Categories | SivaFarm",
  description: "Explore all our farm fresh categories.",
};

export default function CategoriesLayout({ children }) {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <CategorySidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
