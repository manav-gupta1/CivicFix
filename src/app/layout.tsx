import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CivicFix | Spot it. Report it. Fix it.",
  description: "Turn everyday civic problems into actionable reports in seconds.",
};

import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={`${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center px-4 justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary tracking-tight">CivicFix</span>
            </Link>
            <nav className="hidden sm:flex items-center space-x-8 text-sm font-medium">
              <Link href="/report" className="transition-colors hover:text-primary text-foreground/80">Report Problem</Link>
              <Link href="/dashboard" className="transition-colors hover:text-primary text-foreground/80">Dashboard</Link>
              <Link href="/dashboard" className="transition-colors hover:text-primary text-foreground/80">My Reports</Link>
            </nav>
            <div className="sm:hidden flex items-center space-x-4 text-sm font-medium">
              <Link href="/report" className="text-primary font-semibold">Report</Link>
              <Link href="/dashboard" className="text-foreground/80">Dashboard</Link>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
