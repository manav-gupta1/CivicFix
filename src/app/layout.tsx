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
            <a href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">CivicFix</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="/report" className="transition-colors hover:text-foreground/80 text-foreground/60">Report</a>
              <a href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
