import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reel Generator",
  description: "Generate short-form reels from any video URL using Cloudinary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} style={{ background: "var(--background)" }}>
      <body>{children}</body>
    </html>
  );
}
