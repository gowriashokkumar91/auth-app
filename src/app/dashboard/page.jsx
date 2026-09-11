"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  useProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} from "@/redux/slices/auth.slice";
import CartPage from "@/components/Cart";
import { removeFromWishlist } from "@/redux/slices/wishlist.slice";
import { addToCart } from "@/redux/slices/cart.slice";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useGetMyOrdersQuery } from "@/redux/slices/order.slice";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: {
      doorNo: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const [updateProfileMutation, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [uploadProfileImage] = useUploadProfileImageMutation();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);

    const tab = searchParams.get("tab");
    if (
      tab &&
      ["orders", "wishlist", "password", "profile", "cart"].includes(tab)
    ) {
      setActiveTab(tab);
    } else if (!tab) {
      setActiveTab("orders"); // default tab
    }
  }, [searchParams]);

  const token = isClient ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (isClient && !token) {
      router.push("/login");
    }
  }, [isClient, token, router]);

  const {
    data: user,
    isLoading,
    error,
  } = useProfileQuery(undefined, {
    skip: !isClient || !token,
  });

  const { data: realOrders = [], isLoading: ordersLoading } =
    useGetMyOrdersQuery(undefined, {
      skip: !isClient || !token,
    });

  useEffect(() => {
    if (error) {
      toast.error("Session Expired");
      localStorage.removeItem("token");
      dispatch(logout());
      router.push("/login");
    }
  }, [error, dispatch, router]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const executeLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem("token");
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (!isClient || isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex justify-center items-center bg-background">
        <div className="flex flex-col items-center">
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
          <h1 className="text-xl font-medium text-primary/70">
            Loading Portal...
          </h1>
        </div>
      </div>
    );
  }

  const renderOrders = () => {
    if (ordersLoading) {
      return (
        <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-primary mb-4"
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
          <p className="text-primary/70">Loading your orders...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold border-b border-primary/10 pb-4">
          Order History
        </h2>
        {realOrders.length === 0 ? (
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-primary/70 mb-4 text-lg">
              You haven't placed any orders yet.
            </p>
            <Link
              href="/categories"
              className="text-primary font-bold hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {realOrders.map((order) => (
              <div
                key={order._id}
                className="glass-panel p-5 rounded-2xl border border-primary/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-lg">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        order.status === "Delivered"
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : order.status === "Processing"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                      }`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>
                  <p className="text-sm text-primary/70">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} •{" "}
                    {order.items?.length || 0} Items
                  </p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="font-extrabold text-lg">
                    ₹{order.totalAmount}
                  </span>
                  <button
                    onClick={() =>
                      setSelectedOrder({
                        id: `#${order._id.substring(order._id.length - 6).toUpperCase()}`,
                        date: new Date(order.createdAt).toLocaleDateString(),
                        status: order.status || "Processing",
                        items: order.items?.length || 0,
                        total: `₹${order.totalAmount}`,
                        deliveryAddress: order.deliveryAddress,
                        fullOrder: order,
                      })
                    }
                    className="text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderWishlist = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold border-b border-primary/10 pb-4">
        My Wishlist
      </h2>
      {wishlistItems.length === 0 ? (
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
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p className="text-primary/70 mb-4 text-lg">
            Your wishlist is empty.
          </p>
          <Link
            href="/categories"
            className="text-primary font-bold hover:underline"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 items-start">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="glass-panel p-4 rounded-2xl flex flex-col group hover:shadow-lg transition-all border border-primary/5"
            >
              <div className="w-full h-40 bg-primary/5 rounded-xl overflow-hidden relative mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                  unoptimized
                />
                <button
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-white shadow-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
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
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <h4 className="font-bold truncate">{product.name}</h4>
              <p className="text-sm font-semibold text-primary/60 mb-3">
                ₹{product.price} / {product.unit}
              </p>
              <button
                onClick={() => {
                  dispatch(addToCart(product));
                  dispatch(removeFromWishlist(product.id));
                  toast.success("Moved to cart!");
                }}
                className="mt-auto w-full py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleEditProfileClick = () => {
    if (isEditingProfile) {
      // Cancel edit
      setIsEditingProfile(false);
    } else {
      // Start edit
      setProfileForm({
        name: user?.name || "",
        phone: user?.phone || "",
        address: {
          doorNo: user?.address?.doorNo || "",
          street: user?.address?.street || "",
          city: user?.address?.city || "",
          state: user?.address?.state || "",
          zipCode: user?.address?.zipCode || "",
          country: user?.address?.country || "",
        },
      });
      setIsEditingProfile(true);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfileMutation(profileForm).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // 1. Upload the image to S3
      const uploadRes = await uploadProfileImage(formData).unwrap();
      const imageUrl = uploadRes.url;

      // 2. Update the user profile with the new image URL
      await updateProfileMutation({ profileImage: imageUrl }).unwrap();

      toast.success("Profile image updated successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error(err?.data?.message || "Failed to update profile image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const renderProfile = () => (
    <form onSubmit={handleProfileSave} className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b border-primary/10 pb-4 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold whitespace-nowrap">
          My Profile
        </h2>
        {isEditingProfile ? (
          <div className="flex gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleEditProfileClick}
              className="bg-primary/5 hover:bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-colors text-xs sm:text-sm"
              disabled={isUpdatingProfile}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-sm"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              Save
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleEditProfileClick}
            className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm shadow-sm shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>
      <div className="bg-white border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg shadow-primary/20 border-4 border-white overflow-hidden relative ${!user?.profileImage && "bg-gradient-to-br from-primary to-primary/60"}`}
              >
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span>
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}

                {/* Overlay for uploading/hover */}
                <div
                  className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity ${isUploadingImage ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  {isUploadingImage ? (
                    <svg
                      className="animate-spin h-8 w-8 text-white"
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
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white mb-1"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
                      </svg>
                      <span className="text-white text-xs font-bold">
                        Upload
                      </span>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role || "Customer"}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 w-full">
            {isEditingProfile ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div>
                    <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      required
                      className="w-full bg-white border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium"
                    />
                  </div>

                  {/* Email block in edit mode (disabled) */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                      Email Address (Non-editable)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full bg-secondary/30 border-2 border-transparent rounded-xl py-2.5 px-4 text-primary/60 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-primary/10">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary/70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Shipping Address
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                        Door No. / Flat No.
                      </label>
                      <input
                        type="text"
                        value={profileForm.address.doorNo}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            address: {
                              ...profileForm.address,
                              doorNo: e.target.value,
                            },
                          })
                        }
                        placeholder="12A"
                        className="w-full bg-white border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={profileForm.address.street}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            address: {
                              ...profileForm.address,
                              street: e.target.value,
                            },
                          })
                        }
                        placeholder="Main St"
                        className="w-full bg-white border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileForm.address.city}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            address: {
                              ...profileForm.address,
                              city: e.target.value,
                            },
                          })
                        }
                        placeholder="Mumbai"
                        className="w-full bg-white border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                        State
                      </label>
                      <input
                        type="text"
                        value={profileForm.address.state}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            address: {
                              ...profileForm.address,
                              state: e.target.value,
                            },
                          })
                        }
                        placeholder="Maharashtra"
                        className="w-full bg-white border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={profileForm.address.zipCode}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            address: {
                              ...profileForm.address,
                              zipCode: e.target.value,
                            },
                          })
                        }
                        placeholder="400001"
                        className="w-full bg-white border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-1 block">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profileForm.address.country}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            address: {
                              ...profileForm.address,
                              country: e.target.value,
                            },
                          })
                        }
                        placeholder="India"
                        className="w-full bg-white border-2 border-primary/20 rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-transparent mt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  <div className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-primary/40 mt-1 shrink-0"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div className="min-w-0 break-words w-full">
                      <p className="text-[8px] font-bold text-primary/40 uppercase tracking-wider mb-0.5">
                        Full Name
                      </p>
                      <p className="font-semibold text-xs text-primary/90">
                        {user?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:col-span-2 xl:col-span-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-primary/40 mt-1 shrink-0"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <div className="min-w-0 break-words w-full">
                      <p className="text-[8px] font-bold text-primary/40 uppercase tracking-wider mb-0.5">
                        Email Address
                      </p>
                      <p
                        className="font-semibold text-xs text-primary/90 break-all"
                        title={user?.email}
                      >
                        {user?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-primary/40 mt-1 shrink-0"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div className="min-w-0 break-words w-full">
                      <p className="text-[8px] font-bold text-primary/40 uppercase tracking-wider mb-0.5">
                        Phone Number
                      </p>
                      <p className="font-semibold text-xs text-primary/90">
                        {user?.phone || "Not Added"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-green-500 mt-1 shrink-0"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="m9 11 3 3L22 4" />
                    </svg>
                    <div className="min-w-0 break-words w-full">
                      <p className="text-[8px] font-bold text-primary/40 uppercase tracking-wider mb-0.5">
                        Account Status
                      </p>
                      <p className="font-semibold text-xs text-green-600">
                        Active
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-2 pt-3 border-t border-primary/5 flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-primary/40 mt-1 shrink-0"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div className="min-w-0 break-words w-full">
                      <p className="text-[8px] font-bold text-primary/40 uppercase tracking-wider mb-1">
                        Shipping Address
                      </p>
                      {user?.address?.street ? (
                        <p className="font-medium text-[11px] leading-relaxed text-primary/80 max-w-md">
                          {user?.address?.doorNo && `${user.address.doorNo}, `}
                          {user.address.street}
                          <br />
                          {user.address.city}, {user.address.state} -{" "}
                          {user.address.zipCode}
                          <br />
                          {user.address.country}
                        </p>
                      ) : (
                        <p className="text-primary/40 italic text-[11px]">
                          No shipping address provided yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );

  const renderPassword = () => (
    <div className="animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-primary mb-2">
          Security Settings
        </h2>
        <p className="text-primary/70">
          Update your password to keep your account secure.
        </p>
      </div>

      <div className="bg-white border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Decorative corner element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>

        <form
          className="space-y-6 relative z-10"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Password changed successfully!");
            e.target.reset();
          }}
        >
          {/* Current Password */}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">
              Current Password
            </label>
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                type={showPassword.current ? "text" : "password"}
                required
                placeholder="Enter current password"
                className="w-full bg-secondary/30 border border-primary/20 rounded-xl py-3.5 pl-11 pr-12 text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-primary/30 font-medium"
              />
              <button
                type="button"
                onClick={() => togglePassword("current")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary/40 hover:text-primary transition-colors focus:outline-none"
              >
                {showPassword.current ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-primary mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </div>
                <input
                  type={showPassword.new ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full bg-secondary/30 border border-primary/20 rounded-xl py-3.5 pl-11 pr-12 text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-primary/30 font-medium"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("new")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary/40 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword.new ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </div>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Repeat password"
                  className="w-full bg-secondary/30 border border-primary/20 rounded-xl py-3.5 pl-11 pr-12 text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-primary/30 font-medium"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary/40 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword.confirm ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-primary/10 flex justify-start">
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-95 flex items-center gap-2 group"
            >
              Update Password
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
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const sidebarLinks = [
    {
      id: "profile",
      label: "My Profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "My Orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
  ];

  const renderOrderModal = () => {
    if (!selectedOrder) return null;
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-primary/10 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-4 sm:p-6 border-b border-primary/10 flex justify-between items-start sm:items-center gap-3 bg-primary/5">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="break-all">Order {selectedOrder.id}</span>
                <span
                  className={`whitespace-nowrap shrink-0 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${
                    selectedOrder.status === "Delivered"
                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                      : selectedOrder.status === "Processing"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-primary/70 mt-1">
                Placed on {selectedOrder.date}
              </p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary/60 hover:text-red-500 hover:bg-red-500/10 transition-colors shadow-sm border border-primary/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-3">
                Items in this order ({selectedOrder.items})
              </h4>
              <div className="space-y-3">
                {selectedOrder.fullOrder?.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-3 rounded-xl border border-primary/5 bg-primary/5 items-center"
                  >
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary/40"
                      >
                        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                        <path d="M2 7h20" />
                        <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold break-words">{item.name}</h5>
                      <p className="text-xs text-primary/60">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Delivery Address
                </h4>
                <p className="text-sm text-primary/70 leading-relaxed whitespace-pre-wrap">
                  {user?.name || "User Name"}
                  <br />
                  {selectedOrder.deliveryAddress || "Address not provided"}
                  <br />
                  Phone: {user?.phone || "+91 98765 43210"}
                </p>
              </div>
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  Payment Info
                </h4>
                <div className="text-sm text-primary/70 leading-relaxed space-y-1">
                  <div>
                    Method:{" "}
                    {selectedOrder.fullOrder?.razorpayOrderId
                      ? "Razorpay Online"
                      : "Cash on Delivery"}
                  </div>
                  <div>Status: {selectedOrder.status}</div>

                  <div className="flex justify-between pt-2">
                    <span>Subtotal:</span>
                    <span>
                      ₹
                      {selectedOrder.fullOrder?.subtotal ||
                        selectedOrder.total.replace("₹", "")}
                    </span>
                  </div>
                  {selectedOrder.fullOrder?.greensSavings > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Greens Savings:</span>
                      <span>- ₹{selectedOrder.fullOrder.greensSavings}</span>
                    </div>
                  )}
                  {selectedOrder.fullOrder?.firstOrderDiscount > 0 && (
                    <div className="flex justify-between text-accent font-medium">
                      <span>First Order Discount:</span>
                      <span>
                        - ₹{selectedOrder.fullOrder.firstOrderDiscount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>
                      {selectedOrder.fullOrder?.deliveryFee === 0
                        ? "FREE"
                        : `+ ₹${selectedOrder.fullOrder?.deliveryFee || 0}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-primary/10 pt-1 mt-1 font-bold text-primary">
                    <span>Total Amount:</span>
                    <span>{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-primary/10 bg-zinc-50 flex justify-end">
            <button
              onClick={() => setSelectedOrder(null)}
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfile();
      case "orders":
        return renderOrders();
      case "wishlist":
        return renderWishlist();
      case "password":
        return renderPassword();
      case "cart":
        return <CartPage isEmbedded={true} />;
      default:
        return renderProfile();
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 relative z-20">
          <div className="glass-panel p-3 md:p-4 rounded-2xl md:rounded-3xl sticky top-24 border border-primary/10 shadow-lg">
            {/* Mobile Dropdown Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-primary/5 hover:bg-primary/10 transition-colors text-primary font-bold rounded-xl"
            >
              <span className="flex items-center gap-3 capitalize">
                {activeTab === "cart" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    My Cart
                  </>
                ) : activeTab === "password" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Change Password
                  </>
                ) : (
                  <>
                    {sidebarLinks.find((link) => link.id === activeTab)?.icon}
                    {activeTab.replace("-", " ")}
                  </>
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <nav
              className={`${isMobileMenuOpen ? "flex" : "hidden"} md:flex flex-col gap-2 mt-3 md:mt-0`}
            >
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setIsMobileMenuOpen(false);
                    if (typeof window !== "undefined") {
                      window.history.pushState(null, "", `?tab=${link.id}`);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all w-full text-left ${
                    activeTab === link.id
                      ? "bg-primary text-white shadow-md md:translate-x-2"
                      : "text-primary/70 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setActiveTab("cart");
                  setIsMobileMenuOpen(false);
                  if (typeof window !== "undefined") {
                    window.history.pushState(null, "", `?tab=cart`);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all w-full text-left ${
                  activeTab === "cart"
                    ? "bg-primary text-white shadow-md md:translate-x-2"
                    : "text-primary/70 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                My Cart
              </button>
              <div className="my-1 border-t border-primary/10"></div>
              <button
                onClick={() => {
                  setActiveTab("password");
                  setIsMobileMenuOpen(false);
                  if (typeof window !== "undefined") {
                    window.history.pushState(null, "", `?tab=password`);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all w-full text-left ${
                  activeTab === "password"
                    ? "bg-primary text-white shadow-md md:translate-x-2"
                    : "text-primary/70 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Change Password
              </button>
              <div className="my-1 border-t border-primary/10"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-red-500 hover:bg-red-500/10 transition-all w-full text-left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full">
          <div className="glass-panel p-6 sm:p-10 rounded-3xl min-h-[500px] border border-primary/10 shadow-lg relative overflow-hidden">
            {/* Decorative element for main content */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[50px] -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -z-10" />

            {renderContent()}
          </div>
        </main>
      </div>
      {renderOrderModal()}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-8 rounded-3xl w-[90%] max-w-sm shadow-2xl flex flex-col items-center animate-slide-up border border-white/20">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Ready to leave?</h3>
            <p className="text-sm text-primary/70 text-center mb-8">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl font-medium border border-zinc-200 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeLogout}
                className="flex-1 py-3 px-4 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
