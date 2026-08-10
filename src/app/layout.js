import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://auth-app-pi-lime.vercel.app"),
  title: "Sivamazhil | 100% Organic & Fresh Farm Produce",
  description:
    "உழவரிடமிருந்து நேரடியாக உங்கள் இல்லத்திற்கு. Directly from farmers to your home, ensuring maximum freshness and fair prices for our local growers.",
  keywords: [
    "Sivamazhil",
    "Organic vegetables",
    "Fresh farm produce",
    "Farmers market online",
    "Fresh fruits",
    "Buy organic online",
    "Farm to home",
  ],
  authors: [{ name: "Sivamazhil" }],
  creator: "Sivamazhil",
  publisher: "Sivamazhil",
  openGraph: {
    title: "Sivamazhil | Fresh Farm Produce",
    description:
      "Directly from farmers to your home, ensuring maximum freshness and fair prices for our local growers.",
    url: "/",
    siteName: "Sivamazhil",
    images: [
      {
        url: "/seo-banner.png",
        width: 1200,
        height: 630,
        alt: "Sivamazhil Fresh Farm Produce",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sivamazhil | Fresh Farm Produce",
    description: "Directly from farmers to your home.",
    images: ["/seo-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "MWhW-1skSX4w0ECnbL1SDRUAU3aW5syy-gUSGpAXF5M",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-primary">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop={true}
            closeOnClick
            theme="light"
          />
        </Providers>
      </body>
    </html>
  );
}
