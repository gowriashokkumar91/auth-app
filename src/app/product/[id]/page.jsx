"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGetProductByIdQuery } from "@/redux/slices/product.slice";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlist.slice";
import { addToCart } from "@/redux/slices/cart.slice";
import { addViewedProduct } from "@/redux/slices/recentlyViewed.slice";
import { toast } from "react-toastify";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(id, {
    skip: !mounted || !id,
  });

  const [quantity, setQuantity] = useState(1);

  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isWishlisted = product
    ? wishlistItems.some((item) => item.id === product.id)
    : false;

  useEffect(() => {
    if (product && mounted) {
      dispatch(addViewedProduct(product));
    }
  }, [product, mounted, dispatch]);

  const handleToggleWishlist = () => {
    if (!product) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!isAuthenticated && !token) {
      toast.warning("Please login or signup to add items to wishlist.");
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      toast.info(`${product.name} removed from wishlist`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const handleCartClick = () => {
    const isGreens = product.category === "greens";
    const currentPrice = isGreens
      ? Math.round(product.price * 0.8)
      : product.price;
    const discountPercentage = isGreens ? "20%" : null;

    dispatch(
      addToCart({
        ...product,
        cartQuantity: quantity,
        currentPrice: currentPrice,
        discountPercentage: discountPercentage,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.warning("Please login to proceed to checkout");
      return;
    }
    router.push(`/checkout?productId=${id}&quantity=${quantity}`);
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex justify-center items-center bg-background">
        <svg
          className="animate-spin h-10 w-10 text-primary mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex flex-col justify-center items-center bg-background">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Product Not Found
        </h1>
        <button
          onClick={() => router.push("/categories")}
          className="text-white bg-primary px-6 py-2 rounded-xl font-bold"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const isGreens = product.category === "greens";
  const originalPrice = product.price;
  const currentPrice = isGreens
    ? Math.round(originalPrice * 0.8)
    : originalPrice;
  const discountPercentage = isGreens ? "20%" : null;

  // Mock array for multiple images if they existed
  const images = [product.image];

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-primary/60 font-medium mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${product.category.toLowerCase()}`}
            className="hover:text-primary transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-primary font-bold truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Column - Images */}
          <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col gap-4 mx-auto lg:mx-0">
            <div className="w-full aspect-square bg-white rounded-3xl overflow-hidden relative shadow-sm border border-primary/10 p-4 sm:p-6 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <button
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-primary/40 hover:text-red-500 transition-colors z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? "#ef4444" : "none"}
                  stroke={isWishlisted ? "#ef4444" : "currentColor"}
                  strokeWidth="2.5"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            {/* Thumbnails (if multiple images existed) */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden relative border-2 flex-shrink-0 transition-colors ${activeImage === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons (Mobile: Fixed bottom, Desktop: Under image) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-primary/10 z-50 lg:static lg:bg-transparent lg:border-t-0 lg:p-0 flex gap-8 mt-2">
              <button
                onClick={handleCartClick}
                disabled={
                  product.stock <= 0 || product.status === "Out of Stock"
                }
                className={`flex-1 bg-white border-2 border-accent text-accent py-3.5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-sm transition-colors ${
                  product.stock <= 0 || product.status === "Out of Stock"
                    ? "opacity-50 cursor-not-allowed hover:bg-white"
                    : "hover:bg-accent/5"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={
                  product.stock <= 0 || product.status === "Out of Stock"
                }
                className={`flex-1 bg-accent text-white py-3.5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                  product.stock <= 0 || product.status === "Out of Stock"
                    ? "opacity-50 cursor-not-allowed shadow-none"
                    : "hover:bg-accent/90 shadow-lg shadow-accent/30"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m13 18 5-5-5-5" />
                  <path d="m5 18 5-5-5-5" />
                </svg>
                Buy Now
              </button>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="w-full lg:w-[55%] flex flex-col pt-2 lg:pt-0 pb-20 lg:pb-0">
            <div className="p-5 sm:p-6 rounded-3xl mb-4 relative overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] w-full h-auto border border-gray-100">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#4F7942] mb-0.5 leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Price, Quantity & Specs Container */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3.5 mt-2 border-b border-gray-100 pb-3.5 w-full">
                {/* Left Column (Price & Quantity) */}
                <div className="flex flex-col gap-3">
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-[#8FB569] mr-0.5">
                        ₹
                      </span>
                      <span className="text-3xl font-extrabold text-[#4F7942] tracking-tight">
                        {currentPrice * quantity}
                      </span>
                    </div>
                    {discountPercentage && (
                      <div className="flex items-baseline gap-1.5 ml-1">
                        <span className="text-sm font-medium text-gray-400 line-through">
                          ₹{originalPrice * quantity}
                        </span>
                        <span className="text-[10px] font-bold text-[#5B8C2A] bg-[#5B8C2A]/10 px-1.5 py-0.5 rounded-md tracking-wide uppercase">
                          {discountPercentage} off
                        </span>
                      </div>
                    )}
                    <span className="text-xs font-bold text-[#8FB569] ml-1">
                      / {quantity} {product.unit}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-extrabold text-[#5B8C2A]">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-white w-fit overflow-hidden shadow-sm">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 flex items-center justify-center text-[#5B8C2A] hover:bg-[#5B8C2A]/5 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="w-10 text-center font-extrabold text-[#4F7942] text-lg">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity(
                              Math.min(product.stock || 10, quantity + 1)
                            )
                          }
                          className="w-10 h-10 flex items-center justify-center text-[#5B8C2A] hover:bg-[#5B8C2A]/5 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm font-bold ml-2">
                        {product.stock <= 0 ||
                        product.status === "Out of Stock" ? (
                          <span className="text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="text-[#5B8C2A] bg-[#5B8C2A]/10 px-2 py-1 rounded-md border border-[#5B8C2A]/20">
                            {product.stock} {product.unit} left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (Shelf Life & Category) */}
                <div className="flex flex-col gap-3 min-w-[140px] sm:pr-8">
                  {/* Shelf Life */}
                  <div>
                    {product.category === "greens" ||
                    product.category === "vegetables" ||
                    product.category === "fruits" ? (
                      <>
                        <p className="text-[10px] text-[#8FB569] font-black uppercase tracking-widest mb-1.5">
                          Shelf life (Best Before)
                        </p>
                        <p className="text-sm font-extrabold text-[#4F7942]">
                          3-5 Days (Refrigerated)
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] text-[#8FB569] font-black uppercase tracking-widest mb-1.5">
                          Shelf life
                        </p>
                        <p className="text-sm font-extrabold text-[#4F7942]">
                          24 Months
                        </p>
                      </>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <p className="text-[10px] text-[#8FB569] font-black uppercase tracking-widest mb-1.5">
                      Category
                    </p>
                    <p className="text-sm font-extrabold text-[#4F7942] capitalize">
                      {product.category}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Highlights / Benefits */}
              <div className="mt-1.5">
                <h3 className="text-sm font-extrabold text-[#4F7942] mb-1.5 border-b border-gray-100 pb-1.5">
                  Product Highlights
                </h3>

                {/* Highlights derived from the previous benefits modal */}
                {product.description ? (
                  <p className="text-sm font-medium text-[#8FB569] leading-relaxed mb-3 whitespace-pre-line">
                    {product.description}
                  </p>
                ) : (
                  <ul className="space-y-2 mb-3">
                    <li className="flex items-start gap-2 text-[14px] font-medium text-[#6B934F]">
                      <span className="text-[#3b82f6] mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Rich in Antioxidants
                    </li>
                    <li className="flex items-start gap-2 text-[14px] font-medium text-[#6B934F]">
                      <span className="text-[#3b82f6] mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Boosts Immunity
                    </li>
                    <li className="flex items-start gap-2 text-[14px] font-medium text-[#6B934F]">
                      <span className="text-[#3b82f6] mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Improves Digestion
                    </li>
                    <li className="flex items-start gap-2 text-[14px] font-medium text-[#6B934F]">
                      <span className="text-[#3b82f6] mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Supports Blood Sugar Control
                    </li>
                    <li className="flex items-start gap-2 text-[14px] font-medium text-[#6B934F]">
                      <span className="text-[#3b82f6] mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Promotes Bone Health
                    </li>
                    <li className="flex items-start gap-2 text-[14px] font-medium text-[#6B934F]">
                      <span className="text-[#3b82f6] mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Low in Calories
                    </li>
                    <li className="flex items-start gap-2 text-[14px] font-medium text-[#6B934F]">
                      <span className="text-[#3b82f6] mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Supports Healthy Skin
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
