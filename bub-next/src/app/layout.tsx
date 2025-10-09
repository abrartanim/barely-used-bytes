'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/'];
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        {!noSidebarRoutes.includes(pathname) && <SideBar />}
        <main className="flex-1 flex flex-col">
          {!noSidebarRoutes.includes(pathname) && <NavBar />}
          {children}
        </main>
      </body>
    </html>
  );
}
