"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// Product type based on the backend schema
interface Product {
  productId: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  currency: string;
  condition: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  location: {
    city: string;
    country: string;
  };
  status: string;
  specifications: string;
  yearsUsed: number;
  negotiable: boolean;
  shippingOptions: string[];
  postedAt: string;
  updatedAt: string;
  views: number;
}

const UserProfilePage = () => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [userListings, setUserListings] = useState<Product[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's listings from the API
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;

      try {
        setListingsLoading(true);
        setError(null);

        // The /products endpoint is public, no auth needed
        const response = await fetch("http://localhost:8000/products");

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const products: Product[] = await response.json();

        // Filter products to only show the current user's listings
        const myListings = products.filter(
          (product) => product.sellerId === user.uid
        );

        setUserListings(myListings);
      } catch (err) {
        console.error("Error fetching listings:", err);
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError(
            "Cannot connect to the server. Make sure the backend is running on port 8000."
          );
        } else {
          setError("Failed to load your listings. Please try again later.");
        }
      } finally {
        setListingsLoading(false);
      }
    };

    if (user) {
      fetchUserListings();
    }
  }, [user]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <main className="flex flex-1 justify-center items-center py-5 px-4 sm:px-10 text-stone-100">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  // Format the join date from Firebase user metadata
  const formatJoinDate = () => {
    if (user.metadata.creationTime) {
      const date = new Date(user.metadata.creationTime);
      return `Joined in ${date.getFullYear()}`;
    }
    return "Member";
  };

  return (
    <main className="flex flex-1 justify-center py-5 px-4 sm:px-10 text-stone-100">
      <div className="w-full max-w-5xl">
        {/* Profile Header Section */}
        <div className="bg-black/20 rounded-xl p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-6">
              <img
                src={user.photoURL || "https://i.pravatar.cc/120"}
                alt={user.displayName || "User Avatar"}
                className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-full object-cover border-2 border-stone-700"
              />
              <div className="flex flex-col justify-center gap-1">
                <h1 className="text-2xl font-bold">
                  {user.displayName || "User"}
                </h1>
                <p className="text-stone-400 max-w-md">{user.email}</p>
                <p className="text-sm text-stone-500">{formatJoinDate()}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button className="flex-shrink-0 cursor-pointer rounded-lg h-10 px-6 bg-[#007562] text-white text-sm font-bold shadow-sm hover:bg-[#239BA7]/90 w-full sm:w-auto">
                Edit Profile
              </button>
              <button
                onClick={signOut}
                className="flex-shrink-0 cursor-pointer rounded-lg h-10 px-6 bg-red-600/80 text-white text-sm font-bold shadow-sm hover:bg-red-700 w-full sm:w-auto"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mt-8">
          <div className="border-b border-stone-800 px-4">
            <nav aria-label="Tabs" className="-mb-px flex gap-8">
              <a
                href="#"
                className="border-[#239BA7] text-[#007562] whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold"
              >
                Listings
              </a>
              <a
                href="#"
                className="border-transparent text-stone-400 hover:border-stone-700 hover:text-stone-300 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
              >
                Reviews
              </a>
              <a
                href="#"
                className="border-transparent text-stone-400 hover:border-stone-700 hover:text-stone-300 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
              >
                About
              </a>
            </nav>
          </div>
        </div>

        {/* Listings Section */}
        <div className="py-8">
          <div className="px-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Current Listings</h2>
            <Link
              href="/createListing"
              className="text-sm text-[#007562] hover:text-[#239BA7] font-medium"
            >
              + Create New Listing
            </Link>
          </div>

          {/* Loading State */}
          {listingsLoading && (
            <div className="mt-6 px-4 text-center text-stone-400">
              Loading your listings...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-6 px-4 text-center text-red-400">{error}</div>
          )}

          {/* Empty State */}
          {!listingsLoading && !error && userListings.length === 0 && (
            <div className="mt-6 px-4 text-center">
              <p className="text-stone-400 mb-4">
                You haven&apos;t created any listings yet.
              </p>
              <Link
                href="/createListing"
                className="inline-block px-6 py-3 bg-[#007562] text-white text-sm font-bold rounded-lg hover:bg-[#239BA7]/90"
              >
                Create Your First Listing
              </Link>
            </div>
          )}

          {/* Listings Grid */}
          {!listingsLoading && !error && userListings.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
              {userListings.map((product) => (
                <Link
                  key={product.productId}
                  href={`/products/${product.productId}`}
                  className="group"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-stone-800">
                    <img
                      src={product.images[0] || "/placeholder.png"}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:opacity-75 group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-white">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-400">
                    {product.condition}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {product.currency} {product.price.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {product.status === "available" ? "Active" : product.status}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;
