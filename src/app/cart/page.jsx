"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { removeFromCart, updateCartQuantity } from "@/redux/slices/cart.slice";

export default function CartPage({ isEmbedded = false }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);

  const calculateTotals = () => {
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItemCount = 0;

    cartItems.forEach((item) => {
      const originalPrice = item.price;
      const currentPrice =
        item.currentPrice ||
        (item.discount > 0
          ? originalPrice - (originalPrice * item.discount) / 100
          : originalPrice);

      totalOriginalPrice += originalPrice * item.cartQuantity;
      totalDiscountedPrice += currentPrice * item.cartQuantity;
      totalItemCount += item.cartQuantity || 1;
    });

    const totalDiscounts = totalOriginalPrice - totalDiscountedPrice;
    return {
      totalOriginalPrice,
      totalDiscounts,
      totalDiscountedPrice,
      totalItemCount,
    };
  };

  const {
    totalOriginalPrice,
    totalDiscounts,
    totalDiscountedPrice,
    totalItemCount,
  } = calculateTotals();

  if (cartItems.length === 0) {
    if (isEmbedded) {
      return (
        <div className="animate-fade-in w-full">
          <h2 className="text-2xl font-bold border-b border-primary/10 pb-4 mb-6">
            My Cart
          </h2>
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto text-primary/30 mb-4"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p className="text-primary/70 mb-4 text-lg">Your cart is empty.</p>
            <Link
              href="/categories"
              className="text-primary font-bold hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-background">
        <div className="w-48 h-48 mb-6 text-primary/20">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-primary/50 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div
      className={
        isEmbedded
          ? "animate-fade-in w-full"
          : "min-h-screen bg-background pb-20 pt-8"
      }
    >
      <div
        className={isEmbedded ? "" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"}
      >
        {isEmbedded && (
          <h2 className="text-2xl font-bold border-b border-primary/10 pb-4 mb-6">
            My Cart
          </h2>
        )}

        {/* ── Stepper (3 steps, matches checkout) ── */}
        {!isEmbedded && (
          <div className="flex justify-center items-center mb-10 relative w-full max-w-sm mx-auto">
            <div className="absolute top-4 left-8 right-8 h-[2px] bg-primary/10 z-0"></div>
            <div className="flex justify-between w-full relative z-10 px-2">
              {[
                { num: 1, label: "Cart" },
                { num: 2, label: "Address" },
                { num: 3, label: "Payment" },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center bg-background px-1"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                      step.num === 1
                        ? "border-primary text-primary bg-white shadow-md shadow-primary/20"
                        : "border-primary/20 text-primary/30 bg-white"
                    }`}
                  >
                    {step.num}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 font-bold ${
                      step.num === 1 ? "text-primary" : "text-primary/30"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Left: Product Details ── */}
          <div className="w-full lg:w-[62%]">
            <h1 className="text-xl font-bold text-primary mb-4 px-1">
              Product Details
            </h1>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id || item.id}
                  className="glass-panel rounded-2xl overflow-hidden border border-primary/10 shadow-sm"
                >
                  <div className="p-4 flex gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 bg-primary/5 rounded-xl border border-primary/10 overflow-hidden relative shrink-0">
                      <Image
                        src={
                          item.images?.[0] || item.image || "/placeholder.png"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5">
                            <svg
                              className="w-2.5 h-2.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Fresh
                          </div>
                          <h3 className="text-sm font-bold text-primary line-clamp-2 leading-tight">
                            {item.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-extrabold text-primary">
                          ₹{item.currentPrice || item.price}
                        </span>
                        {item.currentPrice &&
                          item.currentPrice < item.price && (
                            <>
                              <span className="text-xs text-primary/40 line-through">
                                ₹{item.price}
                              </span>
                              <span className="text-xs font-bold text-green-600">
                                {Math.round(
                                  ((item.price - item.currentPrice) /
                                    item.price) *
                                    100
                                )}
                                % Off
                              </span>
                            </>
                          )}
                      </div>

                      <div className="flex items-center gap-3 mt-3 text-xs font-medium">
                        <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                          <span className="text-primary/60">Unit:</span>
                          <span className="font-bold text-primary">
                            {item.unit || "kg"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-primary/5 px-2 py-1.5 rounded-lg border border-primary/10">
                          <span className="text-primary/60">Qty:</span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateCartQuantity({
                                  id: item._id || item.id,
                                  quantity: Math.max(1, item.cartQuantity - 1),
                                })
                              )
                            }
                            className="w-5 h-5 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <span className="font-bold text-primary w-4 text-center">
                            {item.cartQuantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateCartQuantity({
                                  id: item._id || item.id,
                                  quantity: item.cartQuantity + 1,
                                })
                              )
                            }
                            className="w-5 h-5 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-primary/10 flex items-center justify-between">
                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item._id || item.id))
                          }
                          className="text-xs font-bold text-primary/50 hover:text-red-500 uppercase flex items-center gap-1.5 transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 px-4 py-2.5 border-t border-primary/10 text-xs text-primary/60 flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Sold by:{" "}
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider">
                      {item.sellerName || "Sivamazhil Direct"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Price Details (Sticky) ── */}
          <div className="w-full lg:w-[38%]">
            <div className="sticky top-24">
              <h2 className="text-lg font-bold text-primary mb-4 px-1">
                Price Details ({totalItemCount}{" "}
                {totalItemCount === 1 ? "Item" : "Items"})
              </h2>

              <div className="glass-panel rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary/60 border-b border-dashed border-primary/30 pb-0.5">
                      Product Price
                    </span>
                    <span className="font-semibold text-primary">
                      + ₹{totalOriginalPrice}
                    </span>
                  </div>

                  {totalDiscounts > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 border-b border-dashed border-green-300 pb-0.5 font-medium">
                        Total Discounts
                      </span>
                      <span className="font-bold text-green-600">
                        - ₹{totalDiscounts}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-primary/10">
                    <span className="font-extrabold text-primary text-base">
                      Order Total
                    </span>
                    <span className="font-black text-primary text-xl">
                      ₹{totalDiscountedPrice}
                    </span>
                  </div>

                  {totalDiscounts > 0 && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold py-2 px-3 rounded-lg">
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Yay! You saved ₹{totalDiscounts} on this order
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="bg-primary/5 px-5 py-4 border-t border-primary/10">
                  <p className="text-[10px] text-primary/40 font-medium text-center mb-3">
                    Clicking on 'Continue' will not deduct any money
                  </p>
                  <button
                    onClick={() => router.push("/checkout?step=2")}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-primary/25 transition-all active:scale-95"
                  >
                    Continue
                  </button>

                  {/* Trust Badge */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-primary font-black text-xs">
                        Your Safety, Our Priority
                      </p>
                      <p className="text-[10px] text-primary/50 leading-tight mt-0.5 max-w-[160px]">
                        Your package is safe at every point of contact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
