"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useProfileQuery } from "@/redux/slices/auth.slice";
import { useGetProductByIdQuery } from "@/redux/slices/product.slice";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetOrderByIdQuery,
} from "@/redux/slices/order.slice";
import { clearCart } from "@/redux/slices/cart.slice";
import { toast } from "react-toastify";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const productId = searchParams.get("productId");
  const initialQuantity = parseInt(searchParams.get("quantity") || "1", 10);
  const initialStep = parseInt(searchParams.get("step") || "1", 10);

  const [checkoutQuantity, setCheckoutQuantity] = useState(initialQuantity);
  const [step, setStep] = useState(initialStep);
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const { data: user, isLoading: isUserLoading } = useProfileQuery();
  const { data: product, isLoading: isProductLoading } = useGetProductByIdQuery(
    productId,
    {
      skip: !productId,
    }
  );

  const cartItems = useSelector((state) => state.cart.items);
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const isCartCheckout = !productId;

  const { data: orderStatusData } = useGetOrderByIdQuery(currentOrderId, {
    skip: !currentOrderId || isOrderSuccess,
    pollingInterval: 3000,
  });

  useEffect(() => {
    if (orderStatusData && orderStatusData.status !== "Pending Payment") {
      if (isCartCheckout) dispatch(clearCart());
      setIsOrderSuccess(true);
      setIsProcessing(false);

      // Close razorpay modal if it's still open
      const rzpModal = document.querySelector(".razorpay-checkout-frame");
      if (rzpModal) {
        rzpModal.remove();
      }
    }
  }, [orderStatusData, isCartCheckout, dispatch]);

  useEffect(() => {
    if (isCartCheckout && cartItems.length === 0) {
      toast.error("Your cart is empty");
      router.push("/dashboard?tab=cart");
    }
  }, [isCartCheckout, cartItems.length, router]);

  useEffect(() => {
    if (!isCartCheckout && !isProductLoading && !product) {
      toast.error("No product selected for checkout");
      router.push("/");
    }
  }, [isCartCheckout, isProductLoading, product, router]);

  useEffect(() => {
    if (user && !deliveryInfo) {
      const info = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address
          ? `${user.address.doorNo || ""} ${user.address.street || ""}, ${user.address.city || ""}, ${user.address.state || ""} - ${user.address.zipCode || ""}`
              .trim()
              .replace(/^,\s*/, "")
          : "",
      };
      setDeliveryInfo(info);
      setEditForm(info);
    }
  }, [user, deliveryInfo]);

  const checkoutItems = useMemo(() => {
    if (isCartCheckout) {
      return cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        quantity: item.cartQuantity,
        price:
          item.currentPrice ||
          (item.discount > 0
            ? item.price - (item.price * item.discount) / 100
            : item.price),
        originalPrice: item.price,
        image: item.images?.[0] || item.image || "/placeholder.png",
        unit: item.unit || "kg",
      }));
    } else if (product) {
      const isGreens =
        product.category === "greens" || product.category === "Greens";
      const finalPrice = isGreens
        ? Math.round(product.price * 0.8)
        : product.discount > 0
          ? product.price - (product.price * product.discount) / 100
          : product.price;

      return [
        {
          productId: product._id || product.id,
          name: product.name,
          quantity: checkoutQuantity,
          price: finalPrice,
          originalPrice: product.price,
          image: product.images?.[0] || product.image || "/placeholder.png",
          unit: product.unit || "kg",
          category: product.category,
        },
      ];
    }
    return [];
  }, [isCartCheckout, cartItems, product, checkoutQuantity]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast.warning("Please login to proceed to checkout");
      router.push("/login?redirect=/checkout?step=2");
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || (!isCartCheckout && isProductLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10 text-primary"
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
          <p className="text-primary/70 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0 || !user) return null;

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalOriginalPrice = checkoutItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const totalDiscount = totalOriginalPrice - subtotal;

  const totalGreensSavings = checkoutItems.reduce((sum, item) => {
    const isGreens = item.category === "greens" || item.category === "Greens";
    if (isGreens) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const otherDiscount = totalDiscount - totalGreensSavings;

  const firstOrderDiscount = user?.isFirstOrder
    ? Math.round(subtotal * 0.25)
    : 0;
  const newSubtotal = subtotal - firstOrderDiscount;

  const deliveryFee = 0; // Temporarily removed: newSubtotal > 500 ? 0 : 50;
  const totalAmount = newSubtotal + deliveryFee;
  const totalItemCount = checkoutItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const currentDeliveryInfo = deliveryInfo || {
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const handleSaveAddress = () => {
    if (!editForm.name || !editForm.phone || !editForm.address) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setDeliveryInfo({ ...editForm });
    setIsEditingAddress(false);
  };

  const handlePlaceOrder = async () => {
    if (!currentDeliveryInfo.address) {
      toast.error("Please provide a delivery address.");
      setStep(2);
      return;
    }

    setIsProcessing(true);

    try {
      // Create the order upfront (Pending Payment if Online, Processing if COD)
      const orderPayload = {
        customerName: currentDeliveryInfo.name,
        email: currentDeliveryInfo.email,
        phone: currentDeliveryInfo.phone || "Not provided",
        deliveryAddress: currentDeliveryInfo.address,
        items: checkoutItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: newSubtotal,
        greensSavings: totalGreensSavings,
        firstOrderDiscount: firstOrderDiscount,
        deliveryFee: deliveryFee,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
      };

      const response = await createOrder(orderPayload).unwrap();
      const dbOrder = response.order || response; // Handle both online and COD responses

      setCurrentOrderId(dbOrder._id);

      if (paymentMethod === "COD") {
        if (isCartCheckout) dispatch(clearCart());
        setIsOrderSuccess(true);
      } else if (paymentMethod === "Online") {
        // Handle Online Payment
        const res = await loadRazorpayScript();
        if (!res) {
          toast.error(
            "Razorpay SDK failed to load. Please check your connection."
          );
          setIsProcessing(false);
          return;
        }

        const razorpayOrder = response.razorpayOrder;

        if (!razorpayOrder || !razorpayOrder.id) {
          toast.error("Failed to initialize payment gateway.");
          setIsProcessing(false);
          return;
        }

        const options = {
          key: razorpayOrder.key_id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Sivamazhil",
          description: "Fresh Produce Order",
          image: "/logos.png",
          order_id: razorpayOrder.id,
          handler: async function (paymentResponse) {
            try {
              // Verify the payment
              await verifyPayment({
                orderId: dbOrder._id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }).unwrap();

              if (isCartCheckout) dispatch(clearCart());
              setIsOrderSuccess(true);
            } catch (err) {
              toast.error(err?.data?.message || "Payment verification failed.");
              setIsProcessing(false);
            }
          },
          prefill: {
            name: currentDeliveryInfo.name,
            email: currentDeliveryInfo.email,
            contact: currentDeliveryInfo.phone,
          },
          theme: {
            color: "#4e8c1f", // matching the primary color
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (failResponse) {
          toast.error(failResponse.error.description);
          setIsProcessing(false);
        });
        paymentObject.open();
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to place order");
      setIsProcessing(false);
    }
  };

  const steps = [
    { num: 1, label: "Cart" },
    { num: 2, label: "Address" },
    { num: 3, label: "Payment" },
  ];

  if (isOrderSuccess) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 bg-primary/5">
        <div className="relative z-10 max-w-sm w-full bg-white border-2 border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[2rem] p-8 text-center animate-fade-in-up">
          {/* Cute Bouncy Checkmark */}
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5 animate-bounce">
            <svg
              className="w-10 h-10 text-primary drop-shadow-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-primary mb-2">
            Order Placed!
          </h2>

          <p className="text-primary/70 text-sm mb-8 font-medium px-2">
            Yay! Your order was successfully placed. A detailed receipt has been
            sent to your email.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/dashboard?tab=orders")}
              className="w-full bg-primary text-white font-bold py-3.5 px-6 rounded-xl hover:bg-primary/90 transition-transform active:scale-95 shadow-md shadow-primary/30"
            >
              View My Orders
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full bg-transparent text-primary/70 font-bold py-2.5 px-6 rounded-xl hover:bg-primary/5 transition-colors active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Stepper ── */}
        <div className="flex justify-center items-center mb-10 relative w-full max-w-sm mx-auto">
          <div className="absolute top-4 left-8 right-8 h-[2px] bg-primary/10 z-0"></div>
          <div className="flex justify-between w-full relative z-10 px-2">
            {steps.map((s) => {
              const isCompleted = step > s.num;
              const isActive = step === s.num;
              return (
                <div
                  key={s.num}
                  className="flex flex-col items-center bg-background px-1"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                      isCompleted
                        ? "border-primary bg-primary text-white"
                        : isActive
                          ? "border-primary text-primary bg-white shadow-md shadow-primary/20"
                          : "border-primary/20 text-primary/30 bg-white"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 font-bold transition-colors ${isActive || isCompleted ? "text-primary" : "text-primary/30"}`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Left: Step Content ── */}
          <div className="w-full lg:w-[62%] flex flex-col gap-5">
            {/* STEP 1: Cart Review */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-extrabold text-primary mb-3 px-1">
                  Product Details
                </h2>

                {checkoutItems.map((item, index) => (
                  <div
                    key={item.productId || index}
                    className="glass-panel rounded-2xl overflow-hidden border border-primary/10 shadow-sm mb-4"
                  >
                    <div className="p-4 flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-primary/5 rounded-xl border border-primary/10 overflow-hidden relative shrink-0">
                        <Image
                          src={item.image}
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
                            ₹{item.price * item.quantity}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-xs text-primary/40 line-through">
                              ₹{item.originalPrice * item.quantity}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-3 text-xs font-medium">
                          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                            <span className="text-primary/60">Unit:</span>
                            <span className="font-bold text-primary">
                              {item.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                            <span className="text-primary/60">Qty:</span>
                            <span className="font-bold text-primary">
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border border-primary/20 hover:border-primary group mt-4"
                >
                  Proceed to Address
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* STEP 2: Delivery Address */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-extrabold text-primary mb-3 px-1">
                  Delivery Address
                </h2>
                <div className="glass-panel rounded-2xl border border-primary/10 shadow-sm p-5 mb-5">
                  <div className="flex justify-between items-center mb-4 border-b border-primary/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-primary text-base">
                        Shipping Details
                      </h3>
                    </div>
                    {!isEditingAddress && (
                      <button
                        onClick={() => {
                          setEditForm({ ...currentDeliveryInfo });
                          setIsEditingAddress(true);
                        }}
                        className="text-sm font-bold text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="w-full bg-background border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+91 98765 43210"
                            className="w-full bg-background border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                          Full Address *
                        </label>
                        <textarea
                          value={editForm.address}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: e.target.value,
                            })
                          }
                          rows={3}
                          placeholder="Door No, Street, City, State - Pincode"
                          className="w-full bg-background border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium text-sm resize-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setIsEditingAddress(false)}
                          className="px-4 py-2 rounded-xl text-sm font-bold text-primary/60 bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/10"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveAddress}
                          className="px-6 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="mt-0.5 shrink-0">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary text-base">
                          {currentDeliveryInfo.name || "—"}
                        </h4>
                        <p className="text-sm text-primary/60 mt-1 leading-relaxed max-w-sm">
                          {currentDeliveryInfo.address || (
                            <span className="italic text-primary/40">
                              No address provided. Click Edit to add one.
                            </span>
                          )}
                        </p>
                        <p className="text-sm font-semibold text-primary/70 mt-1.5">
                          {currentDeliveryInfo.phone || "No phone"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-primary/60 bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (
                        !currentDeliveryInfo.address ||
                        !currentDeliveryInfo.phone
                      ) {
                        toast.error(
                          "Please fill in your delivery address and phone."
                        );
                        return;
                      }
                      setStep(3);
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/20 group"
                  >
                    Continue to Payment
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-extrabold text-primary mb-3 px-1">
                  Payment Method
                </h2>

                {/* Online Payment Option */}
                <div
                  onClick={() => setPaymentMethod("Online")}
                  className={`glass-panel cursor-pointer rounded-2xl border-2 p-5 mb-4 relative overflow-hidden shadow-sm transition-all ${paymentMethod === "Online" ? "border-primary bg-primary/5" : "border-primary/10 hover:border-primary/30 bg-white"}`}
                >
                  {paymentMethod === "Online" && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                      Selected
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-[4px] shadow-inner flex items-center justify-center ${paymentMethod === "Online" ? "border-primary bg-white" : "border-primary/30"}`}
                    >
                      {paymentMethod === "Online" && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-base font-bold text-primary">
                      Razorpay (Online Payment)
                    </span>
                  </div>
                  <p className="text-sm text-primary/60 mt-2 ml-8 leading-relaxed">
                    Pay securely using UPI, Credit/Debit Cards, or Netbanking.
                  </p>
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`glass-panel cursor-pointer rounded-2xl border-2 p-5 mb-4 relative overflow-hidden shadow-sm transition-all ${paymentMethod === "COD" ? "border-primary bg-primary/5" : "border-primary/10 hover:border-primary/30 bg-white"}`}
                >
                  {paymentMethod === "COD" && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                      Selected
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-[4px] shadow-inner flex items-center justify-center ${paymentMethod === "COD" ? "border-primary bg-white" : "border-primary/30"}`}
                    >
                      {paymentMethod === "COD" && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-base font-bold text-primary">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <p className="text-sm text-primary/60 mt-2 ml-8 leading-relaxed">
                    Pay securely with cash when your order arrives at your
                    doorstep.
                  </p>
                </div>

                {/* Order Summary */}
                <div className="glass-panel rounded-2xl border border-primary/10 p-5 mb-5">
                  <h3 className="font-bold text-primary mb-3 text-sm uppercase tracking-wider">
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-3 max-h-40 overflow-y-auto pr-2">
                    {checkoutItems.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <div className="w-12 h-12 bg-primary/5 rounded-lg border border-primary/10 overflow-hidden relative shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-primary text-sm line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-primary/50">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <span className="font-extrabold text-primary">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-primary/10 flex justify-between items-center">
                    <p className="text-sm text-primary/60">Deliver to:</p>
                    <p className="text-sm font-bold text-primary max-w-[55%] text-right truncate">
                      {currentDeliveryInfo.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-primary/60 bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Price Summary (Sticky) ── */}
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
                      + ₹{subtotal}
                    </span>
                  </div>

                  {otherDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary/60 border-b border-dashed border-primary/30 pb-0.5">
                        Product Discount
                      </span>
                      <span className="font-semibold text-green-600">
                        - ₹{otherDiscount}
                      </span>
                    </div>
                  )}

                  {totalGreensSavings > 0 && (
                    <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded-lg -mx-2 px-2 border border-green-100">
                      <span className="font-bold text-green-700">
                        ✨ Total Greens Savings
                      </span>
                      <span className="font-black text-green-700">
                        - ₹{totalGreensSavings}
                      </span>
                    </div>
                  )}

                  {firstOrderDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary/60 border-b border-dashed border-primary/30 pb-0.5">
                        First Order Discount (25%)
                      </span>
                      <span className="font-semibold text-accent animate-pulse">
                        - ₹{firstOrderDiscount}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary/60 border-b border-dashed border-primary/30 pb-0.5">
                      Delivery Fee
                    </span>
                    <span
                      className={`font-bold ${deliveryFee === 0 ? "text-green-600" : "text-primary"}`}
                    >
                      {deliveryFee === 0 ? "FREE" : `+ ₹${deliveryFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-primary/10">
                    <span className="font-extrabold text-primary text-base">
                      Order Total
                    </span>
                    <span className="font-black text-primary text-xl">
                      ₹{totalAmount}
                    </span>
                  </div>

                  {deliveryFee > 0 && (
                    <p className="text-[11px] text-primary/40 italic text-center">
                      * Add ₹{501 - newSubtotal} more for free delivery!
                    </p>
                  )}

                  {deliveryFee === 0 && (
                    <div className="flex items-center justify-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold py-1.5 px-3 rounded-lg">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Free delivery applied!
                    </div>
                  )}
                </div>

                {/* CTA Section */}
                <div className="bg-primary/5 px-5 py-4 border-t border-primary/10">
                  <p className="text-[10px] text-primary/40 font-medium text-center mb-3">
                    {step < 3
                      ? "Complete all steps to place your order"
                      : "Clicking 'Place Order' will not deduct any money now"}
                  </p>

                  {step === 1 && (
                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-primary/25 transition-all active:scale-95"
                    >
                      Continue
                    </button>
                  )}

                  {step === 2 && (
                    <button
                      onClick={() => {
                        if (
                          !currentDeliveryInfo.address ||
                          !currentDeliveryInfo.phone
                        ) {
                          toast.error("Please complete your delivery address.");
                          return;
                        }
                        setStep(3);
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-primary/25 transition-all active:scale-95"
                    >
                      Continue to Payment
                    </button>
                  )}

                  {step === 3 && (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
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
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  )}

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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <svg
            className="animate-spin h-10 w-10 text-primary"
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
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
