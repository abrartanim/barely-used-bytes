"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../lib/AuthContext";
import { useWishlist } from "../lib/WishlistContext";
import { useCart } from "../lib/CartContext";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleAddToCart = (productId: string) => {
    const product = wishlist.find((p) => p.productId === productId);
    if (product) {
      addToCart(product);
    }
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
      if (product.status === "available") {
        addToCart(product);
      }
    });
    clearWishlist();
  };

  if (authLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm mb-4 text-[#239BA7] hover:underline"
          >
            <FiArrowLeft /> Back to Products
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaHeart className="text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-400 mt-1">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"}{" "}
                saved
              </p>
            </div>

            {wishlist.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={handleMoveAllToCart}
                  className="px-4 py-2 bg-[#007562] text-white rounded-lg hover:bg-[#239BA7] transition-colors"
                >
                  Add All to Cart
                </button>
                <button
                  onClick={clearWishlist}
                  className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 bg-black/20 rounded-lg">
            <FaHeart className="text-6xl text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-4">
              Save items you like by clicking the heart icon
            </p>
            <Link
              href="/products"
              className="px-6 py-3 bg-[#007562] text-white rounded-lg hover:bg-[#239BA7]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Wishlist Items */
          <div className="space-y-4">
            {wishlist.map((product) => (
              <div
                key={product.productId}
                className="bg-black/20 border border-[#30363D] rounded-lg p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <Link
                  href={`/products/${product.productId}`}
                  className="flex-shrink-0"
                >
                  <div className="w-full sm:w-32 h-32 bg-[#1e293b] rounded-lg overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.png"}
                      alt={product.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      unoptimized
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.productId}`}>
                    <h3 className="text-lg font-semibold hover:text-[#7ADAA5] transition-colors truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-sm mt-1">
                    {product.category} • {product.condition}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {product.location.city}, {product.location.country}
                  </p>
                  <p className="text-xl font-bold text-[#7ADAA5] mt-2">
                    {product.currency} {product.price.toLocaleString()}
                  </p>
                  {product.status !== "available" && (
                    <span className="inline-block mt-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                      {product.status}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 sm:justify-center">
                  <button
                    onClick={() => handleAddToCart(product.productId)}
                    disabled={product.status !== "available"}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#239BA7] text-white rounded-lg hover:bg-[#239BA7]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart />
                    <span className="sm:hidden lg:inline">Add to Cart</span>
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.productId)}
                    className="flex-1 sm:flex-none px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    <span className="sm:hidden lg:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
