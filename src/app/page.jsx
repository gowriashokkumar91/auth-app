import Link from "next/link";
import Image from "next/image";
import CategoryMarquee from "@/components/CategoryMarquee";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-73px)]">
      {/* Welcome Offer Banner */}
      <section
        className="w-full px-4 sm:px-8 lg:px-12 mt-4 sm:mt-8 mb-6 opacity-0 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="relative w-full aspect-[16/9] sm:aspect-auto sm:h-[350px] lg:h-[450px] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 group">
          <Image
            src="/banner1.png"
            alt="Welcome offer banner"
            fill
            className="object-cover object-left md:object-center"
            unoptimized
            priority
          />

          <Link
            href="/categories"
            className="absolute bottom-[8%] right-[5%] sm:bottom-[15%] sm:right-[12%] md:bottom-[15%] md:right-[15%] lg:bottom-[18%] lg:right-[22%] flex items-center justify-center bg-[#4c7c2b] text-white font-bold rounded-full hover:bg-[#3d6322] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(76,124,43,0.5)] transition-all duration-300 shadow-lg w-[28%] min-w-[100px] max-w-[140px] h-[28%] min-h-[32px] max-h-[44px] sm:w-[170px] sm:h-[54px] md:w-[190px] md:h-[60px] sm:max-w-none sm:max-h-none group/btn"
          >
            <div className="flex items-center justify-center w-[calc(100%-4px)] h-[calc(100%-4px)] sm:w-[calc(100%-6px)] sm:h-[calc(100%-6px)] md:w-[calc(100%-8px)] md:h-[calc(100%-8px)] border-[1.5px] border-dashed border-white/60 rounded-full gap-1 sm:gap-2 group-hover/btn:border-white transition-colors duration-300">
              <span className="text-[10px] min-[400px]:text-xs sm:text-base md:text-lg whitespace-nowrap">
                Claim Now
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3 min-[400px]:w-3.5 min-[400px]:h-3.5 sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] flex-shrink-0"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1.48 7.3A7.03 7.03 0 0 1 11 20z" />
                <path d="M11 20v-5" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* Recently Viewed Section */}
      <RecentlyViewed />

      <main className="relative flex flex-col items-center justify-center text-center px-4 sm:px-8 lg:px-12 py-4 sm:py-8 z-10 w-full overflow-hidden bg-accent/5 border-y border-accent/10 shadow-inner">
        {/* Subtle background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="w-full max-w-5xl flex flex-col items-center relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs uppercase tracking-widest mb-6 opacity-0 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            100% Organic & Farm Fresh
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 opacity-0 animate-slide-up leading-tight sm:leading-tight text-primary"
            style={{ animationDelay: "0.2s" }}
          >
            Fresh Farm Produce, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-600 drop-shadow-sm">
              Delivered to You.
            </span>
          </h1>

          <div
            className="flex flex-col items-center gap-3 mb-10 opacity-0 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-xl sm:text-2xl text-primary/80 font-bold max-w-2xl leading-relaxed">
              உழவரிடமிருந்து நேரடியாக உங்கள் இல்லத்திற்கு
            </p>
            <p className="text-base sm:text-lg text-primary/60 font-medium max-w-2xl leading-relaxed">
              Directly from farmers to your home, ensuring maximum freshness and
              fair prices for our local growers.
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto opacity-0 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/categories"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-accent hover:bg-accent/90 text-white text-lg font-bold shadow-[0_8px_30px_rgba(78,140,31,0.3)] transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              Shop Now
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
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-primary border-2 border-primary/10 hover:border-primary/30 text-lg font-bold hover:bg-primary/5 transition-all shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 opacity-0 animate-slide-up"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 */}
          <div className="group relative flex flex-col items-start text-left p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-zinc-100 dark:border-zinc-800 hover:shadow-[0_8px_30px_rgba(78,140,31,0.1)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden z-10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10 group-hover:bg-accent/20 transition-colors duration-500" />
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent/10 to-accent/5 text-accent rounded-[14px] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm border border-accent/10">
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-primary mb-2 tracking-tight group-hover:text-accent transition-colors duration-300">
              100% Organic
            </h3>
            <p className="text-primary/70 font-medium leading-relaxed text-[13px] sm:text-sm">
              Our produce is grown without any synthetic fertilizers or
              pesticides, ensuring natural goodness.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative flex flex-col items-start text-left p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-zinc-100 dark:border-zinc-800 hover:shadow-[0_8px_30px_rgba(78,140,31,0.1)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden z-10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10 group-hover:bg-accent/20 transition-colors duration-500" />
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent/10 to-accent/5 text-accent rounded-[14px] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm border border-accent/10">
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
                <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
                <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-primary mb-2 tracking-tight group-hover:text-accent transition-colors duration-300">
              Fast Delivery
            </h3>
            <p className="text-primary/70 font-medium leading-relaxed text-[13px] sm:text-sm">
              Straight from the farm to your doorstep within 24 hours to
              guarantee maximum freshness.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative flex flex-col items-start text-left p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-zinc-100 dark:border-zinc-800 hover:shadow-[0_8px_30px_rgba(78,140,31,0.1)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden z-10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10 group-hover:bg-accent/20 transition-colors duration-500" />
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent/10 to-accent/5 text-accent rounded-[14px] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm border border-accent/10">
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
                <path d="M14 19a6 6 0 0 0-8-10.94M15.53 5.47a6 6 0 0 1 2.94 10.53" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-primary mb-2 tracking-tight group-hover:text-accent transition-colors duration-300">
              Sustainable Farming
            </h3>
            <p className="text-primary/70 font-medium leading-relaxed text-[13px] sm:text-sm">
              Every purchase directly supports our farm and helps us build a
              sustainable agricultural ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Weekend Special Banner */}
      <section
        className="w-full px-4 sm:px-8 lg:px-12 py-8 opacity-0 animate-slide-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="relative w-full h-[250px] sm:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 group">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
            alt="Fresh farm produce banner"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16 text-white w-full sm:max-w-2xl">
            <span className="inline-block px-3 py-1 bg-accent text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-full mb-3 sm:mb-4 w-fit shadow-lg shadow-accent/20">
              Weekend Special
            </span>
            <h2 className="text-2xl sm:text-5xl font-extrabold mb-2 sm:mb-4 leading-tight text-white drop-shadow-md">
              Get <span className="text-accent">20% Off</span> on{" "}
              <br className="hidden sm:block" /> Organic Greens
            </h2>
            <p className="text-xs sm:text-lg text-white/90 mb-4 sm:mb-8 max-w-md drop-shadow-sm font-medium">
              Freshly harvested from our farms, delivered straight to your door
              within 24 hours.
            </p>
            <Link
              href="/categories/vegetables"
              className="w-fit flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 bg-white text-primary text-sm sm:text-base font-bold rounded-full hover:bg-accent hover:text-white transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-accent/40"
            >
              Explore Offer
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <CategoryMarquee />
    </div>
  );
}
