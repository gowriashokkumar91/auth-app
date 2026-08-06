"use client";

import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout, useProfileQuery } from "@/redux/slices/auth.slice";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSearchProductsQuery } from "@/redux/slices/product.slice";
import { toast } from "react-toastify";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [isClient, setIsClient] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const wishlistItemCount = useSelector(
    (state) => state.wishlist?.items?.length || 0
  );
  const cartItemCount = useSelector(
    (state) =>
      state.cart?.items?.reduce(
        (total, item) => total + (item.cartQuantity || 1),
        0
      ) || 0
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  const { data: searchResults = [], isFetching } = useSearchProductsQuery(
    searchTerm,
    {
      skip: searchTerm.trim().length < 1,
    }
  );

  useEffect(() => {
    // eslint-disable-next-line
    setIsClient(true);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const executeLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem("token");
    dispatch(logout());
    toast.success("Successfully logged out!");
    router.push("/login");
  };

  const hasToken = isClient ? !!localStorage.getItem("token") : false;
  const isLogged = isAuthenticated || hasToken;

  const { data: profileUser } = useProfileQuery(undefined, {
    skip: !isClient || !isLogged,
  });

  const displayUser = profileUser || user;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-primary/10 shadow-sm bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-2 gap-y-3 gap-x-2 sm:gap-8">
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform hover:scale-[1.02] flex-shrink-0"
        >
          <div className="bg-white rounded-full w-10 sm:w-11 h-10 sm:h-11 flex items-center justify-center overflow-hidden shadow-sm border border-primary/20 flex-shrink-0">
            <Image
              src="/logos.png"
              alt="Sivamazhil Icon"
              width={100}
              height={100}
              className="w-full h-full object-cover scale-[0.9]"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-primary font-extrabold text-lg sm:text-xl leading-none mb-1 tracking-wide uppercase">
              Sivamazhil
            </span>
            <span className="text-primary/80 text-[9px] sm:text-[10px] leading-none font-bold">
              உழவரிடமிருந்து நேரடியாக உங்கள் இல்லத்திற்கு
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6 w-full md:w-auto order-last md:order-none ml-auto justify-between md:justify-end flex-1 md:flex-none mt-2 md:mt-0">
          <Link
            href="/"
            className="hidden sm:flex flex-shrink-0 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold shadow-md hover:bg-primary/90 transition-colors"
          >
            Home
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="hidden sm:flex flex-shrink-0 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold shadow-md hover:bg-primary/90 transition-colors"
            >
              Admin
            </Link>
          )}
          <div
            ref={searchRef}
            className="relative w-full max-w-md flex items-center flex-1"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchTerm.trim()) {
                  setShowSuggestions(false);
                  router.push(
                    `/categories/search?q=${encodeURIComponent(searchTerm)}`
                  );
                }
              }}
              className="relative w-full flex items-center"
            >
              <input
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (searchTerm.trim().length > 0) setShowSuggestions(true);
                }}
                placeholder="Search products..."
                className="w-full bg-primary/5 border border-primary/20 text-primary rounded-md px-4 py-2.5 pl-11 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm placeholder:text-primary/40"
                autoComplete="off"
              />
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
                className="absolute left-3.5 text-primary/40"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchTerm.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-primary/10 overflow-hidden z-50 animate-slide-up max-h-96 overflow-y-auto">
                {isFetching ? (
                  <div className="p-4 text-center text-sm text-primary/60 animate-pulse">
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-primary/60">
                    No products found for "{searchTerm}"
                  </div>
                ) : (
                  <ul className="flex flex-col">
                    {searchResults.slice(0, 5).map((product) => (
                      <li
                        key={product._id || product.id}
                        className="border-b border-primary/5 last:border-0"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setShowSuggestions(false);
                            router.push(
                              `/categories/search?q=${encodeURIComponent(product.name)}`
                            );
                          }}
                          className="w-full text-left p-3 hover:bg-primary/5 transition-colors flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary/5 relative flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-bold text-primary text-sm break-words whitespace-normal">
                              {product.name}
                            </span>
                            <span className="text-primary/60 text-xs">
                              ₹{product.price} / {product.unit}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                    {searchResults.length > 5 && (
                      <li className="border-t border-primary/5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowSuggestions(false);
                            router.push(
                              `/categories/search?q=${encodeURIComponent(searchTerm)}`
                            );
                          }}
                          className="w-full text-center p-3 text-sm font-bold text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          View all {searchResults.length} results
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => {
                document
                  .getElementById("contact-footer")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-primary hover:text-primary/80 transition-colors p-1"
              title="Contact Us"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>
            {!isLogged ? (
              <>
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 transition-colors p-1"
                  title="Login / Register"
                >
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
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard?tab=orders"
                  className="relative text-primary hover:text-primary/80 transition-colors p-1"
                  title="Orders"
                >
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
                  >
                    <path d="m7.5 4.27 9 5.15" />
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                </Link>
                <Link
                  href="/dashboard?tab=wishlist"
                  className="relative text-primary hover:text-primary/80 transition-colors p-1"
                  title="Wishlist"
                >
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
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {isClient && wishlistItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center shadow-sm border-2 border-white animate-fade-in">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  className="relative text-primary hover:text-primary/80 transition-colors p-1"
                  title="Cart"
                >
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
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  {isClient && cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center shadow-sm border-2 border-white animate-fade-in">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isLogged && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="text-primary hover:text-primary/80 transition-colors p-1 focus:outline-none flex items-center"
                  title="Profile Menu"
                >
                  {displayUser?.profileImage ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 relative shadow-sm">
                      <Image
                        src={displayUser.profileImage}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : displayUser?.name ? (
                    <div className="w-8 h-8 rounded-full bg-primary text-white border border-primary/20 flex items-center justify-center font-bold text-sm shadow-sm">
                      {displayUser.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
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
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </button>

                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-primary/10 overflow-hidden z-50 animate-slide-up py-2">
                    {displayUser?.name && (
                      <div className="px-4 py-3 border-b border-primary/10 mb-2">
                        <p className="font-bold text-sm text-primary truncate">
                          {displayUser.name}
                        </p>
                        <p className="text-xs text-primary/60 truncate">
                          {displayUser.email}
                        </p>
                      </div>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-primary/5 transition-colors text-primary w-full text-left"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      My Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogoutClick();
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors text-red-500 w-full text-left mt-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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
              <h3 className="text-xl font-bold mb-2 text-primary">
                Ready to leave?
              </h3>
              <p className="text-sm text-primary/70 text-center mb-8">
                Are you sure you want to log out of your account?
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeLogout}
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Sub-menu (Hidden on categories pages where sidebar is present) */}
      {!pathname?.startsWith("/categories") && (
        <div className="flex bg-secondary/30 border-t border-primary/10 w-full overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-end gap-6 sm:gap-8 py-2.5 overflow-x-auto no-scrollbar text-[12px] sm:text-[13px] font-bold text-primary/80 uppercase tracking-wider">
            <Link
              href="/categories/vegetables"
              className="hover:text-accent transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              Vegetables
            </Link>
            <Link
              href="/categories/fruits"
              className="hover:text-accent transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              Fruits
            </Link>
            <Link
              href="/categories/grains"
              className="hover:text-accent transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              Grains
            </Link>
            <Link
              href="/categories/greens"
              className="hover:text-accent transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              Greens
            </Link>
            <Link
              href="/categories/pulses-nuts"
              className="hover:text-accent transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              Pulses & Nuts
            </Link>
            <Link
              href="/categories/fodder"
              className="hover:text-accent transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              Fodder
            </Link>
            <Link
              href="/categories/seeds"
              className="hover:text-accent transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              Seeds
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
