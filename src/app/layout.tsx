import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Expense Tracker - Theo dõi Thu Chi",
  description: "Ứng dụng theo dõi thu chi cá nhân với giao diện tiếng Việt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
