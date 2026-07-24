"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/auth.slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // eslint-disable-next-line
    setIsClient(true);
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

  return (
    <nav className="sticky top-0 z-50 glass-panel px-6 py-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
      <Link
        href="/"
        className="text-2xl font-extrabold tracking-tight text-gradient hover:opacity-80 transition-opacity"
      >
        NexAuth
      </Link>

      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors"
        >
          Home
        </Link>

        {isLogged ? (
          <>
            <Link
              href="/profile"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={handleLogoutClick}
              className="text-sm font-medium px-5 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-primary text-zinc-700 dark:text-zinc-300 hover:text-primary hover:shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all bg-white/50 dark:bg-black/50"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium px-5 py-2 rounded-full bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
          >
            Sign In
          </Link>
        )}
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
            <h3 className="text-xl font-bold mb-2">Ready to leave?</h3>
            <p className="text-sm text-zinc-500 text-center mb-8">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
    </nav>
  );
}
