"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addViewedProduct } from "@/redux/slices/recentlyViewed.slice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlist.slice";
import { toast } from "react-toastify";

export default function ProductCard({ product, simplified = false }) {
  const [showBenefits, setShowBenefits] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  // Determine what type of unit is being used to customize UI
  const isKg = product.unit === "kg";

  // Apply 20% offer to greens
  const isGreens = product.category === "greens";
  const originalPrice = product.price;
  const currentPrice = isGreens
    ? Math.round(originalPrice * 0.8)
    : originalPrice;
  const discountText = isGreens ? "20% OFF" : null;

  return (
    <div className="group flex flex-col bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 border border-primary/10 overflow-hidden relative">
      {discountText && (
        <div className="absolute top-0 right-0 bg-accent text-white font-bold text-[10px] px-3 py-1 rounded-bl-xl z-10 shadow-sm">
          {discountText}
        </div>
      )}
      <Link
        href={`/product/${product._id || product.id}`}
        className="flex flex-col flex-grow"
      >
        <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 relative bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
        </div>

        <h3
          className="text-base font-bold text-primary mb-2 leading-tight group-hover:text-accent transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>
      </Link>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold text-primary">
                ₹{currentPrice}
              </span>
              <span className="text-sm font-medium text-primary/60">
                / {product.unit}
              </span>
            </div>
            {isGreens && (
              <span className="text-xs text-primary/50 line-through font-medium">
                ₹{originalPrice} / {product.unit}
              </span>
            )}
            <div className="mt-1.5">
              {product.stock <= 0 || product.status === "Out of Stock" ? (
                <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                  Out of Stock
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                  {product.stock} {product.unit} available
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowBenefits(true);
                dispatch(addViewedProduct(product));
              }}
              className="flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              aria-label="View product benefits"
              title="View Benefits"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/40 hover:text-primary transition-all"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button
              onClick={handleToggleWishlist}
              className="flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={isWishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${isWishlisted ? "text-primary scale-105" : "text-primary/40 hover:text-primary"} transition-all`}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Modal */}
      {showBenefits &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBenefits(false);
            }}
          >
            <div
              className="bg-white p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl flex flex-col items-center animate-slide-up border border-primary/10 relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowBenefits(false);
                }}
                className="absolute top-4 right-4 text-primary/40 hover:text-primary transition-colors p-1"
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
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2 text-center">
                Benefits of {product.name}
              </h3>
              <div className="text-sm text-primary/70 mb-6 space-y-3 font-medium w-full">
                {product.description ? (
                  <p className="text-center whitespace-pre-line">
                    {product.description}
                  </p>
                ) : (
                  <ul className="space-y-3 text-left w-full pl-2">
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">
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
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Rich in Antioxidants
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">
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
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Boosts Immunity
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">
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
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Improves Digestion
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">
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
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Supports Blood Sugar Control
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">
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
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Promotes Bone Health
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">
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
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Low in Calories
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">
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
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Supports Healthy Skin
                    </li>
                  </ul>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowBenefits(false);
                }}
                className="w-full py-3 px-4 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
