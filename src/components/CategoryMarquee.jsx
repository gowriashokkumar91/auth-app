import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Vegetables",
    image:
      "https://recipe-data-gowri.s3.ap-south-1.amazonaws.com/categories/vegetables.png",
  },
  {
    name: "Fruits",
    image:
      "https://recipe-data-gowri.s3.ap-south-1.amazonaws.com/categories/fruits.png",
  },
  {
    name: "Grains",
    image:
      "https://recipe-data-gowri.s3.ap-south-1.amazonaws.com/categories/grains.png",
  },
  {
    name: "Greens",
    image:
      "https://recipe-data-gowri.s3.ap-south-1.amazonaws.com/categories/greens.png",
  },
  {
    name: "Pulses & Nuts",
    image:
      "https://recipe-data-gowri.s3.ap-south-1.amazonaws.com/categories/nuts.png",
  },
  {
    name: "Fodder",
    image:
      "https://recipe-data-gowri.s3.ap-south-1.amazonaws.com/categories/fodder.png",
  },
  {
    name: "Seeds",
    image:
      "https://recipe-data-gowri.s3.ap-south-1.amazonaws.com/categories/seeds.png",
  },
];

export default function CategoryMarquee() {
  // Duplicate categories to create a seamless infinite scrolling effect
  const marqueeItems = [...categories, ...categories, ...categories];

  return (
    <div className="w-full py-16 overflow-hidden relative">
      <div className="w-full mb-8 text-left relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
          Explore Our Categories
        </h2>
        <p className="text-primary/70 font-medium">
          Fresh from the farm to your table
        </p>
      </div>
      <div className="w-full overflow-hidden relative">
        {/* Left and right fade gradients for a smooth scrolling edge */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white ] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white ] to-transparent z-10 pointer-events-none" />

        <div className="flex w-[300%] md:w-[200%] animate-marquee">
          {marqueeItems.map((category, index) => (
            <Link
              href={`/categories/${category.name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`}
              key={index}
              className="flex flex-col items-center justify-center min-w-[120px] sm:min-w-[160px] mx-2 sm:mx-3 group cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:scale-105 group-hover:shadow-primary/30 transition-all duration-300 relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 96px, 128px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="font-bold text-primary/90 text-sm sm:text-base group-hover:text-primary transition-colors whitespace-nowrap">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
