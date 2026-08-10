"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer
      id="contact-footer"
      className="mt-auto pt-12 pb-8 border-t border-zinc-200 bg-secondary"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link
              href="/"
              className="flex items-center gap-3 mb-4 transition-transform hover:scale-[1.02]"
            >
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center overflow-hidden shadow-sm border border-primary/20 flex-shrink-0">
                <Image
                  src="/logos.png"
                  alt="Sivamazhil Logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover scale-[0.9]"
                />
              </div>
              <h2 className="text-2xl font-extrabold text-primary tracking-wide uppercase">
                Sivamazhil
              </h2>
            </Link>
            <p className="text-primary/70 text-sm leading-relaxed max-w-sm">
              Bringing 100% organic, farm-fresh produce straight to your
              kitchen. Eat healthier, live better, and support sustainable local
              agriculture with every order.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left lg:mx-auto">
            <h3 className="text-lg font-bold text-primary mb-4">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm font-medium text-primary/80 hover:text-accent transition-colors"
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium text-primary/80 hover:text-accent transition-colors"
              >
                Shop All
              </Link>
              <Link
                href="/dashboard?tab=cart"
                className="text-sm font-medium text-primary/80 hover:text-accent transition-colors"
              >
                My Cart
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-primary/80 hover:text-accent transition-colors"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left lg:mx-auto">
            <h3 className="text-lg font-bold text-primary mb-4">
              Top Categories
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/categories/vegetables"
                className="text-sm font-medium text-primary/80 hover:text-accent transition-colors"
              >
                Farm Fresh Vegetables
              </Link>
              <Link
                href="/categories/fruits"
                className="text-sm font-medium text-primary/80 hover:text-accent transition-colors"
              >
                Organic Fruits
              </Link>
              <Link
                href="/categories/grains"
                className="text-sm font-medium text-primary/80 hover:text-accent transition-colors"
              >
                Traditional Grains
              </Link>
              <Link
                href="/categories/greens"
                className="text-sm font-medium text-primary/80 hover:text-accent transition-colors"
              >
                Fresh Greens
              </Link>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left lg:ml-auto">
            <h3 className="text-lg font-bold text-primary mb-4">
              Connect With Us
            </h3>

            <div className="flex gap-4 mb-4">
              {/* Mail */}
              <Link
                href="mailto:sivamani242km@gmail.com"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-zinc-800 hover:text-white transition-all shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </Link>
              {/* WhatsApp */}
              <Link
                href="https://wa.me/917812886942"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </Link>
              {/* Instagram */}
              <Link
                href="https://www.instagram.com/_sivamani_02_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-[#E1306C] hover:text-white transition-all shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.968-10.405a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
              </Link>
              {/* Facebook */}
              <Link
                href="https://www.facebook.com/mani.mca.37"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-[#1877F2] hover:text-white transition-all shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </Link>
            </div>

            <div className="flex flex-col gap-2 mt-2 mb-3 items-center md:items-start">
              <span className="text-sm font-bold text-primary/70">
                Have any queries? Feel free to call us!
              </span>
              <a
                href="tel:+917812886942"
                className="text-sm font-bold text-primary/90 hover:text-accent transition-colors flex items-center gap-2"
              >
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +91 78128 86942
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-zinc-200 text-center">
          <p className="text-sm font-medium text-primary/70">
            &copy; {new Date().getFullYear()} Sivamazhil. உழவரிடமிருந்து
            நேரடியாக உங்கள் இல்லத்திற்கு
          </p>
        </div>
      </div>
    </footer>
  );
}
