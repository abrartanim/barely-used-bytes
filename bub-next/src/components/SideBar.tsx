// components/Sidebar.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Importing icons from react-icons
import { IoHardwareChipOutline } from "react-icons/io5";
import {
  BsGpuCard,
  BsMotherboard,
  BsPcDisplayHorizontal,
} from "react-icons/bs";
import { CgSmartphoneRam } from "react-icons/cg";
import { FiHardDrive } from "react-icons/fi";
import { MdOutlinePower } from "react-icons/md";
import { FaFan } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { HiX } from "react-icons/hi";

const navLinks = [
  { name: "CPUs", icon: IoHardwareChipOutline, href: "/cpus" },
  { name: "GPUs", icon: BsGpuCard, href: "/gpus" },
  { name: "Motherboards", icon: BsMotherboard, href: "/motherboards" },
  { name: "RAM", icon: CgSmartphoneRam, href: "/ram" },
  { name: "Storage", icon: FiHardDrive, href: "/storage" },
  { name: "Power Supplies", icon: MdOutlinePower, href: "/power-supplies" },
  { name: "Cases", icon: BsPcDisplayHorizontal, href: "/cases" },
  { name: "Cooling", icon: FaFan, href: "/cooling" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if the current path matches a nav link
  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Hamburger Menu Button (Visible only on mobile) */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#223533] rounded-md text-white"
        aria-label="Open sidebar"
      >
        <HiMenu className="w-6 h-6" />
      </button>

      {/* Overlay (Visible only on mobile when menu is open) */}
      {isMobileMenuOpen && (
        <div
          onClick={toggleMobileMenu}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`text-white w-64 h-screen p-6 flex flex-col
                   fixed top-0 left-0 z-50
                   transform transition-transform duration-300 ease-in-out
                   ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                   md:relative md:translate-x-0 md:h-screen`}
      >
        {/* Close Button (Visible only on mobile inside sidebar) */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden absolute top-4 right-4 p-2 text-white"
          aria-label="Close sidebar"
        >
          <HiX className="w-6 h-6" />
        </button>

        {/* Logo and Title Section */}
        <Link href="/products">
          <div className="flex items-center gap-3 mb-12 mt-8 md:mt-0 cursor-pointer hover:opacity-80 transition-opacity">
            <IoHardwareChipOutline className="text-3xl text-[#38d49c]" />
            <h1 className="font-bold text-xl">Barely Used Bytes</h1>
          </div>
        </Link>

        {/* Navigation Section */}
        <nav className="flex flex-col flex-1">
          <h2 className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-4">
            Categories
          </h2>

          <ul className="flex flex-col gap-y-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => {
                    if (isMobileMenuOpen) {
                      toggleMobileMenu();
                    }
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActiveLink(link.href)
                      ? "bg-[#007562] text-white"
                      : "hover:bg-[#223533] text-gray-300"
                  }`}
                >
                  <link.icon className="text-xl" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Quick Links Section */}
          <div className="mt-auto pt-6 border-t border-gray-700">
            <h2 className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className={`block p-2 rounded-lg transition-colors ${
                    pathname === "/products"
                      ? "text-[#7ADAA5]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className={`block p-2 rounded-lg transition-colors ${
                    pathname === "/wishlist"
                      ? "text-[#7ADAA5]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`block p-2 rounded-lg transition-colors ${
                    pathname === "/profile"
                      ? "text-[#7ADAA5]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
