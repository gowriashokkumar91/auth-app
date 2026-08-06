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
  title: "Sivamazhil | உழவரிடமிருந்து நேரடியாக உங்கள் இல்லத்திற்கு",
  description: "Directly from farmers to your home.",
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
