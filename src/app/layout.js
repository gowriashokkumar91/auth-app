import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import Navbar from "@/components/Navbar";
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
  title: "NexAuth | Secure Authentication",
  description:
    "A modern authentication boilerplate built with Next.js, Redux, and Tailwind CSS.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
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
