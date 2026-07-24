"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout, useProfileQuery } from "@/redux/slices/auth.slice";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const token = isClient ? localStorage.getItem("token") : null;

  // Redirect if token doesn't exist
  useEffect(() => {
    if (isClient && !token) {
      router.push("/login");
    }
  }, [isClient, token, router]);

  // Call protected API
  const {
    data: user,
    isLoading,
    error,
  } = useProfileQuery(undefined, {
    skip: !isClient || !token,
  });

  useEffect(() => {
    if (error) {
      toast.error("Session Expired");
      handleLogout();
    }
  }, [error]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
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
          <h1 className="text-xl font-medium text-zinc-500">
            Loading Profile...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-background flex justify-center items-center relative overflow-hidden py-10">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] -z-10" />

      <div className="glass-panel rounded-3xl p-8 sm:p-12 w-full max-w-lg animate-slide-up mx-4 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-tr from-primary to-pink-500 rounded-full mb-4 p-[3px] shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gradient uppercase">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {user?.name}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">{user?.email}</p>
        </div>

        <div className="bg-white/40 dark:bg-black/40 rounded-2xl p-6 mb-8 border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Account Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <span className="text-zinc-500 font-medium">Status</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-bold border border-green-500/20">
                Active
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 font-medium">Joined</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogoutClick}
          className="w-full flex justify-center items-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-red-500 font-medium py-3.5 rounded-xl transition-all"
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
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
    </div>
  );
}
