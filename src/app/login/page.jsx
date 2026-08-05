"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, setCredentials } from "@/redux/slices/auth.slice";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard?tab=profile";

  const [loginUser, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data).unwrap();

      dispatch(setCredentials({ token: res.token, user: res.user }));
      localStorage.setItem("token", res.token);
      toast.success(res.message);
      reset();

      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (error) {
      toast.error(error?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] -z-10" />

      <div className="glass-panel p-8 sm:p-10 rounded-2xl w-full max-w-md animate-slide-up mx-4 shadow-[0_0_40px_rgba(0,0,0,0.08)] hover:shadow-[0_0_60px_rgba(78,140,31,0.15)] transition-all duration-300 transform hover:-translate-y-1">
        <div className="text-center mb-10 relative">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary drop-shadow-sm mb-4">
            Welcome Back
          </h1>
          <div className="inline-block p-1.5 px-4 rounded-full bg-accent/10 border border-accent/20 shadow-sm transition-transform hover:scale-105">
            <p className="text-[13px] font-bold text-primary tracking-wide">
              உழவரிடமிருந்து நேரடியாக உங்கள் இல்லத்திற்கு
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-primary">
              Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all group-hover:border-accent/50 shadow-sm hover:shadow-md"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-primary">
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all group-hover:border-accent/50 shadow-sm hover:shadow-md"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-accent transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg shadow-[0_4px_14px_0_rgba(78,140,31,0.39)] hover:shadow-[0_6px_20px_rgba(78,140,31,0.23)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-primary/70 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-accent font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
