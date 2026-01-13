"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaRegHeart,
  FaHeart,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";
import { useWishlist } from "@/app/lib/WishlistContext";
import { useCart } from "@/app/lib/CartContext";
import { searchProducts } from "@/app/lib/api";
import { Product } from "@/app/lib/types";

export default function NavBar() {
  const { user, signOut } = useAuth();
  const { wishlist } = useWishlist();
  const { getTotalItems } = useCart();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartItemCount = getTotalItems();
  const wishlistCount = wishlist.length;

  // Handle search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchProducts(searchQuery);
          setSearchResults(results.slice(0, 5)); // Show max 5 results
          setShowResults(true);
        } catch (err) {
          console.error("Search error:", err);
          setSearchResults([]);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (productId: string) => {
    setShowResults(false);
    setSearchQuery("");
    router.push(`/products/${productId}`);
  };

  return (
    <div>
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for components"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchQuery.trim().length >= 2 && setShowResults(true)
              }
              className="w-96 rounded-md border-none bg-[#0f1e1e] py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2e2a] rounded-lg shadow-xl border border-[#30363D] z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-400">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <button
                        key={product.productId}
                        onClick={() => handleResultClick(product.productId)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#007562]/20 transition-colors text-left"
                      >
                        <img
                          src={product.images[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {product.currency} {product.price.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                    <Link
                      href={`/products?search=${encodeURIComponent(
                        searchQuery
                      )}`}
                      onClick={() => setShowResults(false)}
                      className="block px-4 py-3 text-center text-[#7ADAA5] hover:bg-[#007562]/20 border-t border-[#30363D]"
                    >
                      View all results
                    </Link>
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center gap-x-6">
          <Link href="/products" className="text-gray-300 hover:text-white">
            Browse
          </Link>
          <Link
            href="/createListing"
            className="text-gray-300 hover:text-white"
          >
            Sell
          </Link>

          {/* Wishlist Button */}
          <Link
            href="/wishlist"
            className="relative text-gray-300 hover:text-white cursor-pointer"
            title="Wishlist"
          >
            {wishlistCount > 0 ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative text-gray-300 hover:text-white cursor-pointer"
            title="Cart"
          >
            <FaShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7ADAA5] text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link href="/profile">
            <img
              src={user?.photoURL || "https://i.pravatar.cc/120"}
              alt={user?.displayName || "User Avatar"}
              className="h-10 w-10 rounded-full object-cover hover:ring-2 hover:ring-[#7ADAA5] transition-all"
            />
          </Link>

          {/* Sign Out */}
          <button
            type="button"
            onClick={signOut}
            className="text-gray-300 hover:text-white cursor-pointer"
            title="Sign Out"
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </nav>
    </div>
  );
}
