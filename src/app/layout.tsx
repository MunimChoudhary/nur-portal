import type { Metadata } from "next";
import { Amiri, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nur Portal | Elegant Islamic Web App",
  description: "An ultra-elegant, fully optimized Islamic web application featuring Quran, Prayer Times, and Azkar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${amiri.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-inter">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
