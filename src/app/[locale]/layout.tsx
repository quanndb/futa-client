import LoadingWrapper from "@/components/common/LoadingWrapper"; // Direct import without dynamic loading
import ReactQueryProvider from "@/components/common/QueryProvider";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import Navbar from "@/components/layouts/Navbar";
import { routing } from "@/i18n/routing";
import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
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

export const metadata: Metadata = {
  title: "Futa Bus Lines",
  description: "Futa Bus Lines",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
          >
            <ReactQueryProvider>
              <div className="relative">
                <div className="relative z-10">
                  <div className="flex flex-col justify-between min-h-[1300px]">
                    <Header />
                    <Navbar className="absolute w-full max-w-3xl left-1/2 transform -translate-x-1/2 top-12" />
                    {children}
                    <Footer />
                  </div>
                </div>
              </div>
              <ToastContainer />
              <LoadingWrapper />
            </ReactQueryProvider>
          </GoogleOAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
