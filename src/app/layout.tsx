import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "ScholarPay — Cross-Border Student Payments on Stellar",
  description:
    "ScholarPay makes international student payments faster, cheaper, and transparent using the Stellar blockchain. Send tuition, accommodation, and living expense payments worldwide.",
  keywords: ["student payments", "Stellar blockchain", "cross-border payments", "tuition payment", "international students"],
  authors: [{ name: "ScholarPay" }],
  openGraph: {
    title: "ScholarPay — Cross-Border Student Payments on Stellar",
    description: "Fast, transparent, and low-cost international student payments powered by Stellar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050914" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
