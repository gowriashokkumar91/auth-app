import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 animate-[glow_3s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] -z-10 animate-[glow_4s_ease-in-out_infinite_alternate]" />

      <main className="flex flex-col items-center justify-center text-center px-6 sm:px-12 max-w-5xl z-10">
        <div
          className="animate-fade-in opacity-0"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-semibold tracking-wide mb-6 inline-block">
            Introducing NexAuth 2.0
          </span>
        </div>

        <h1
          className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 opacity-0 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Secure Authentication, <br />
          <span className="text-gradient">Done Beautifully.</span>
        </h1>

        <p
          className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl opacity-0 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          A modern, robust authentication boilerplate built with Next.js, Redux
          Toolkit, and Tailwind CSS. Experience seamless login and registration
          flows.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 opacity-0 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-medium hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-0.5"
          >
            Get Started
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
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center px-8 py-3.5 rounded-full glass-panel hover:bg-white/40 dark:hover:bg-white/10 font-medium transition-all"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
