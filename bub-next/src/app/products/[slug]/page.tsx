"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaShippingFast,
  FaCheck,
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Product, Review } from "@/app/lib/types";
import {
  getProductById,
  getReviewsForSeller,
  getReviewsForProduct,
} from "@/app/lib/api";
import { useAuth } from "@/app/lib/AuthContext";
import { useWishlist } from "@/app/lib/WishlistContext";
import { useCart } from "@/app/lib/CartContext";

// Color Palette
const colors = {
  green: "#7ADAA5",
  teal: "#239BA7",
  cream: "#ECECBB",
  gold: "#E1AA36",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const productId = params.slug as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(productId);
        setProduct(data);

        // Also fetch reviews for this product
        try {
          const productReviews = await getReviewsForProduct(productId);
          setReviews(productReviews);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError(
            "Cannot connect to the server. Make sure the backend is running."
          );
        } else {
          setError("Product not found");
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.productId)) {
        removeFromWishlist(product.productId);
      } else {
        addToWishlist(product);
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      router.push("/cart");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ color: colors.cream }}
      >
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ color: colors.cream }}
      >
        <div className="text-xl text-red-400 mb-4">
          {error || "Product not found"}
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ backgroundColor: colors.teal }}
        >
          <FiArrowLeft /> Back to Products
        </Link>
      </div>
    );
  }

  const isOwner = user?.uid === product.sellerId;
  const inWishlist = isInWishlist(product.productId);

  // Calculate average rating from reviews
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ color: colors.cream }}>
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm mb-6 hover:underline"
          style={{ color: colors.teal }}
        >
          <FiArrowLeft /> Back to Products
        </Link>

        {/* Breadcrumbs */}
        <div className="text-sm mb-4">
          <Link
            href="/products"
            style={{ color: colors.teal }}
            className="hover:underline"
          >
            Products
          </Link>
          <span className="text-gray-400"> / </span>
          <Link
            href={`/products?category=${product.category.toLowerCase()}`}
            style={{ color: colors.teal }}
            className="hover:underline"
          >
            {product.category}
          </Link>
          <span className="text-gray-400"> / </span>
          <span className="text-gray-400">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side: Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-[#1e293b] rounded-lg p-4 mb-4 flex items-center justify-center aspect-square">
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.png"}
                alt={product.name}
                width={400}
                height={400}
                className="object-contain max-h-full max-w-full"
                unoptimized
              />
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`bg-[#1e293b] rounded-lg p-2 cursor-pointer border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-[#7ADAA5]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Info */}
          <div className="lg:col-span-3">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {!isOwner && (
                <button
                  onClick={handleWishlistToggle}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  title={
                    inWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  {inWishlist ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-xl hover:text-red-500" />
                  )}
                </button>
              )}
            </div>

            <p className="text-gray-400 mb-4 text-base">
              {product.description}
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <FaMapMarkerAlt style={{ color: colors.teal }} />
              <span>
                {product.location.city}, {product.location.country}
              </span>
            </div>

            {/* Details Card */}
            <div className="bg-[#1e293b] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Condition</span>
                  <span
                    className="font-semibold"
                    style={{ color: colors.green }}
                  >
                    {product.condition}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Years Used</span>
                  <span
                    className="font-semibold"
                    style={{ color: colors.cream }}
                  >
                    {product.yearsUsed}{" "}
                    {product.yearsUsed === 1 ? "year" : "years"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Category</span>
                  <span
                    className="font-semibold"
                    style={{ color: colors.cream }}
                  >
                    {product.category} / {product.subcategory}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Negotiable</span>
                  <span
                    className="font-semibold"
                    style={{
                      color: product.negotiable ? colors.green : colors.cream,
                    }}
                  >
                    {product.negotiable ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Status</span>
                  <span
                    className={`font-semibold ${
                      product.status === "available"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {product.status.charAt(0).toUpperCase() +
                      product.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-700 pt-3 mt-3">
                  <span className="text-gray-400">Price</span>
                  <span
                    className="font-bold text-2xl"
                    style={{ color: colors.cream }}
                  >
                    {product.currency} {product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Options */}
            <div className="bg-[#1e293b] rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FaShippingFast style={{ color: colors.teal }} />
                <span className="font-semibold">Shipping Options</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.shippingOptions.map((option, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-black/30 rounded-full text-sm text-gray-300"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwner && product.status === "available" && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={handleBuyNow}
                  className="text-slate-900 font-bold py-3 px-6 rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: colors.green }}
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="font-bold py-3 px-6 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.teal, color: colors.cream }}
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <>
                      <FaCheck /> Added!
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}

            {isOwner && (
              <div className="mb-8">
                <Link
                  href={`/products/${product.productId}/edit`}
                  className="w-full block text-center font-bold py-3 px-6 rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: colors.teal, color: colors.cream }}
                >
                  Edit Listing
                </Link>
              </div>
            )}

            {/* Seller Information */}
            <div className="bg-[#1e293b] rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">Seller Information</h3>
              <div className="flex items-center">
                <Image
                  src="https://i.pravatar.cc/48"
                  alt="Seller Avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <p className="font-semibold">{product.sellerName}</p>
                  <div className="flex items-center text-sm text-gray-400">
                    <FaStar className="mr-1" style={{ color: colors.gold }} />
                    {avgRating} ({reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        {product.specifications && (
          <div className="mt-12 bg-[#1e293b] rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-line">
              {product.specifications}
            </p>
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-12 bg-[#1e293b] rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="border-b border-gray-700 pb-4 last:border-0"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{review.reviewerName}</span>
                  </div>
                  <p className="text-gray-400">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posted Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Posted on {new Date(product.postedAt).toLocaleDateString()} •{" "}
          {product.views} views
        </div>
      </div>
    </div>
  );
}
