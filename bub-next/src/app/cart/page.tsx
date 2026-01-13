"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../lib/AuthContext";
import { useCart } from "../lib/CartContext";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // In a real app, this would create orders for each item
    // For now, we'll just simulate checkout
    setTimeout(() => {
      alert(
        "Checkout functionality would be implemented here with payment integration."
      );
      setIsCheckingOut(false);
    }, 1000);
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

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Group cart items by currency for display
  const currencyTotals = cart.reduce((acc, item) => {
    const currency = item.product.currency;
    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += item.product.price * item.quantity;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm mb-4 text-[#239BA7] hover:underline"
          >
            <FiArrowLeft /> Continue Shopping
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaShoppingCart className="text-[#239BA7]" />
                Shopping Cart
              </h1>
              <p className="text-gray-400 mt-1">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 bg-black/20 rounded-lg">
            <FaShoppingCart className="text-6xl text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-4">Add some items to get started</p>
            <Link
              href="/products"
              className="px-6 py-3 bg-[#007562] text-white rounded-lg hover:bg-[#239BA7]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.productId}
                  className="bg-black/20 border border-[#30363D] rounded-lg p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.product.productId}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-full sm:w-32 h-32 bg-[#1e293b] rounded-lg overflow-hidden">
                      <Image
                        src={item.product.images[0] || "/placeholder.png"}
                        alt={item.product.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        unoptimized
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.productId}`}>
                      <h3 className="text-lg font-semibold hover:text-[#7ADAA5] transition-colors truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-400 text-sm mt-1">
                      {item.product.category} • {item.product.condition}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Seller: {item.product.sellerName}
                    </p>
                    <p className="text-xl font-bold text-[#7ADAA5] mt-2">
                      {item.product.currency}{" "}
                      {item.product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex sm:flex-col gap-3 items-center sm:justify-center">
                    {/* Quantity Control - for used items, usually 1 but we support more */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.productId,
                            item.quantity - 1
                          )
                        }
                        className="p-2 bg-[#30363D] rounded hover:bg-[#30363D]/80 transition-colors"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.productId,
                            item.quantity + 1
                          )
                        }
                        className="p-2 bg-[#30363D] rounded hover:bg-[#30363D]/80 transition-colors"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.productId)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Remove from cart"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-black/20 border border-[#30363D] rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 border-b border-[#30363D] pb-4 mb-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Items ({totalItems})</span>
                  </div>
                  {Object.entries(currencyTotals).map(([currency, total]) => (
                    <div key={currency} className="flex justify-between">
                      <span className="text-gray-400">
                        Subtotal ({currency})
                      </span>
                      <span className="font-semibold">
                        {currency} {total.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <div className="text-right">
                      {Object.entries(currencyTotals).map(
                        ([currency, total]) => (
                          <div key={currency} className="text-[#7ADAA5]">
                            {currency} {total.toLocaleString()}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3 bg-[#7ADAA5] text-black font-bold rounded-lg hover:bg-[#7ADAA5]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    "Processing..."
                  ) : (
                    <>
                      Proceed to Checkout <FiArrowRight />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By proceeding, you agree to contact the sellers to arrange
                  payment and shipping.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
