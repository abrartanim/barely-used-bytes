"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product, CATEGORIES } from "@/app/lib/types";
import { getAllProducts } from "@/app/lib/api";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

// Map URL slugs to category names
const slugToCategory: { [key: string]: string } = {
  cpus: "CPUs",
  gpus: "GPUs",
  motherboards: "Motherboards",
  ram: "RAM",
  storage: "Storage",
  "power-supplies": "Power Supplies",
  cases: "Cases",
  cooling: "Cooling",
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const categoryName = slugToCategory[categorySlug] || categorySlug;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Get category data
  const categoryData = CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        // Filter by category
        const categoryProducts = allProducts.filter(
          (p) => p.category.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError(
            "Cannot connect to the server. Make sure the backend is running."
          );
        } else {
          setError("Failed to load products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Apply condition filter
    if (selectedCondition !== "all") {
      result = result.filter(
        (p) => p.condition.toLowerCase() === selectedCondition.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime()
        );
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCondition, sortBy]);

  const conditions = [
    "all",
    "Like New",
    "Excellent",
    "Good",
    "Fair",
    "For Parts",
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">Loading {categoryName}...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm mb-4 text-[#239BA7] hover:underline"
        >
          <FiArrowLeft /> Back to All Products
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">{categoryName}</h1>
        <p className="text-gray-400">
          Browse used {categoryName.toLowerCase()} from verified sellers
        </p>

        {/* Subcategories */}
        {categoryData?.subcategories &&
          categoryData.subcategories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categoryData.subcategories.map((sub) => (
                <span
                  key={sub}
                  className="px-3 py-1 bg-[#007562]/20 text-[#7ADAA5] rounded-full text-sm"
                >
                  {sub}
                </span>
              ))}
            </div>
          )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${categoryName.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-[#30363D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007562]"
          />
        </div>

        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="px-4 py-2 bg-black/30 border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007562]"
        >
          <option value="all">All Conditions</option>
          {conditions.slice(1).map((cond) => (
            <option key={cond} value={cond} className="bg-[#11211c]">
              {cond}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-black/30 border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007562]"
        >
          <option value="newest" className="bg-[#11211c]">
            Newest First
          </option>
          <option value="oldest" className="bg-[#11211c]">
            Oldest First
          </option>
          <option value="price-low" className="bg-[#11211c]">
            Price: Low to High
          </option>
          <option value="price-high" className="bg-[#11211c]">
            Price: High to Low
          </option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-4 text-gray-400">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "product" : "products"} found
      </div>

      {/* Error State */}
      {error && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#007562] text-white rounded-lg hover:bg-[#239BA7]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!error && filteredProducts.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-stone-400 text-xl mb-4">
            No {categoryName.toLowerCase()} found
          </div>
          <p className="text-stone-500 mb-4">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Be the first to list one!"}
          </p>
          <Link
            href="/createListing"
            className="px-6 py-3 bg-[#007562] text-white rounded-lg hover:bg-[#239BA7]"
          >
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <Link
              href={`/products/${product.productId}`}
              key={product.productId}
            >
              <ProductCard
                name={product.name}
                price={`${product.currency} ${product.price.toLocaleString()}`}
                condition={product.condition}
                imageUrl={product.images[0] || "/placeholder.png"}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
