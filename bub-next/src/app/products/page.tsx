"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Product } from "@/app/lib/types";
import { getAllProducts } from "@/app/lib/api";
import { FiSearch } from "react-icons/fi";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Initialize search and category from URL params
  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError(
            "Cannot connect to the server. Make sure the backend is running on port 8000."
          );
        } else {
          setError("Failed to load products. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
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
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, selectedCondition, sortBy]);

  // Get unique categories from products
  const categories = [
    "all",
    ...new Set(products.map((p) => p.category.toLowerCase())),
  ];
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
          <div className="text-white text-xl">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#007562] text-white rounded-lg hover:bg-[#239BA7]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Browse Products</h1>
          <div className="text-stone-400">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/30 border border-[#30363D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007562]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-black/30 border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007562]"
          >
            <option value="all">All Categories</option>
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat} className="bg-[#11211c]">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Condition Filter */}
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

          {/* Sort By */}
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
            <option value="popular" className="bg-[#11211c]">
              Most Popular
            </option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-stone-400 text-xl mb-4">No products found</div>
          <p className="text-stone-500">
            Try adjusting your filters or search query
          </p>
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
