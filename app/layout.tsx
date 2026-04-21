'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex font-sans bg-gray-50">
        <AuthGuard>
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Mobile Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C2185B] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CB</span>
                  </div>
                  <span className="font-semibold text-gray-900">City Bug</span>
                </div>
                <div className="w-10" /> {/* Spacer for centering */}
              </div>
            </div>

            {children}
          </main>
        </AuthGuard>
      </body>
    </html>
  );
}
