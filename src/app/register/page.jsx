"use client";

import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/redux/slices/auth.slice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data).unwrap();
      toast.success(res.message);
      reset();
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error(error?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex justify-center items-center relative overflow-hidden bg-background py-10">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] -z-10" />

      <div className="glass-panel p-8 sm:p-10 rounded-2xl w-full max-w-md animate-slide-up mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid Email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center"
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
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
