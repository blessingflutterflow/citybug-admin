import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "City Bug Admin",
  description: "Admin panel for City Bug ride service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex font-sans bg-gray-50">
        <AuthGuard>
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </AuthGuard>
      </body>
    </html>
  );
}
