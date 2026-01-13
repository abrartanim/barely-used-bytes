"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiX, FiCheck, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { useAuth } from "@/app/lib/AuthContext";
import { getProductById, updateProduct, deleteProduct } from "@/app/lib/api";
import { Product, CATEGORIES, CONDITIONS, CURRENCIES } from "@/app/lib/types";

export default function EditProductPage() {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const productId = params.slug as string;

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [condition, setCondition] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [yearsUsed, setYearsUsed] = useState("0");
  const [negotiable, setNegotiable] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [shippingOptions, setShippingOptions] = useState<string[]>([
    "local pickup",
  ]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("available");

  // UI state
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get subcategories based on selected category
  const selectedCategoryData = CATEGORIES.find((c) => c.slug === category);
  const subcategories = selectedCategoryData?.subcategories || [];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const product = await getProductById(productId);

        // Check ownership
        if (user && product.sellerId !== user.uid) {
          setError("You don't have permission to edit this listing.");
          return;
        }

        // Populate form
        setName(product.name);
        // Find the category slug from the name
        const catData = CATEGORIES.find(
          (c) => c.name.toLowerCase() === product.category.toLowerCase()
        );
        setCategory(catData?.slug || "");
        setSubcategory(product.subcategory);
        setDescription(product.description);
        setPrice(product.price.toString());
        setCurrency(product.currency);
        setCondition(product.condition);
        setSpecifications(product.specifications || "");
        setYearsUsed(product.yearsUsed.toString());
        setNegotiable(product.negotiable);
        setCity(product.location.city);
        setCountry(product.location.country);
        setShippingOptions(product.shippingOptions);
        setImages(product.images);
        setStatus(product.status);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProduct();
    }
  }, [productId, user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Handle adding image URL
  const handleAddImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  // Handle removing image
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Handle shipping option toggle
  const handleShippingToggle = (option: string) => {
    if (shippingOptions.includes(option)) {
      if (shippingOptions.length > 1) {
        setShippingOptions(shippingOptions.filter((o) => o !== option));
      }
    } else {
      setShippingOptions([...shippingOptions, option]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to edit a listing.");
      return;
    }

    // Validation
    if (!name.trim() || name.trim().length < 3) {
      setError("Product name must be at least 3 characters.");
      return;
    }
    if (!category || !subcategory) {
      setError("Please select a category and subcategory.");
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (!condition) {
      setError("Please select a condition.");
      return;
    }
    if (images.length === 0) {
      setError("Please add at least one image.");
      return;
    }
    if (!city.trim()) {
      setError("Please enter your city.");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateProduct(productId, {
        name: name.trim(),
        category: selectedCategoryData?.name || category,
        subcategory,
        description: description.trim(),
        price: parseFloat(price),
        currency,
        condition,
        images,
        location: {
          city: city.trim(),
          country,
        },
        status,
        specifications: specifications.trim(),
        yearsUsed: parseInt(yearsUsed) || 0,
        negotiable,
        shippingOptions,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push(`/products/${productId}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating listing:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update listing. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProduct(productId);
      router.push("/profile");
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete listing. Please try again.");
      setIsDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="container mx-auto px-4 py-12 text-[#ECECBB]">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (error && !name) {
    return (
      <main className="container mx-auto px-4 py-12 text-[#ECECBB]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-2 text-red-400">{error}</h1>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[#239BA7] hover:underline mt-4"
            >
              <FiArrowLeft /> Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="container mx-auto px-4 py-12 text-[#ECECBB]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-8">
            <FiCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Listing Updated!</h1>
            <p className="text-[#ECECBB]/70">Redirecting to your listing...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#ECECBB]">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href={`/products/${productId}`}
          className="inline-flex items-center gap-2 text-sm mb-6 text-[#239BA7] hover:underline"
        >
          <FiArrowLeft /> Back to Listing
        </Link>

        {/* Page Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Edit Listing</h1>
          <p className="mt-2 text-md text-[#ECECBB]/70">
            Update the details of your listing.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#11211c] border border-[#30363D] rounded-lg p-6 max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Delete Listing?</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this listing? This action cannot
                be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 border border-[#30363D] rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Status Card */}
          <div className="bg-black/20 border border-[#30363D] p-6 rounded-lg">
            <h2 className="text-lg font-bold border-b border-[#30363D] pb-4 mb-6">
              Listing Status
            </h2>
            <div className="flex flex-wrap gap-3">
              {["available", "sold", "reserved"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    status === s
                      ? s === "available"
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : s === "sold"
                        ? "bg-red-500/20 border-red-500 text-red-400"
                        : "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                      : "border-[#30363D] text-[#ECECBB]/70 hover:border-[#ECECBB]/50"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Card */}
          <div className="bg-black/20 border border-[#30363D] p-6 rounded-lg">
            <h2 className="text-lg font-bold border-b border-[#30363D] pb-4 mb-6">
              Product Details
            </h2>
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="product-name"
                  className="block text-sm font-medium mb-2"
                >
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="product-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] focus:border-[#239BA7] outline-none placeholder:text-[#ECECBB]/40"
                  maxLength={100}
                />
              </div>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-2"
                  >
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubcategory("");
                    }}
                    className="w-full appearance-none rounded-lg border border-[#7ADAA5]/30 bg-[#7ADAA5]/10 px-3 py-2 outline-none focus:border-[#7ADAA5] focus:ring-2 focus:ring-[#7ADAA5]"
                  >
                    <option value="" className="bg-[#0D1117]">
                      Select a category
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option
                        key={cat.slug}
                        value={cat.slug}
                        className="bg-[#0D1117]"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="subcategory"
                    className="block text-sm font-medium mb-2"
                  >
                    Subcategory <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="subcategory"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    disabled={!category}
                    className="w-full appearance-none rounded-lg border border-[#7ADAA5]/30 bg-[#7ADAA5]/10 px-3 py-2 outline-none focus:border-[#7ADAA5] focus:ring-2 focus:ring-[#7ADAA5] disabled:opacity-50"
                  >
                    <option value="" className="bg-[#0D1117]">
                      Select a subcategory
                    </option>
                    {subcategories.map((sub) => (
                      <option key={sub} value={sub} className="bg-[#0D1117]">
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium mb-2"
                  >
                    Price <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium mb-2"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-[#30363D] bg-black/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[#239BA7]"
                  >
                    {CURRENCIES.map((cur) => (
                      <option key={cur} value={cur} className="bg-[#0D1117]">
                        {cur}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Condition and Years Used */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="condition"
                    className="block text-sm font-medium mb-2"
                  >
                    Condition <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-[#30363D] bg-black/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[#239BA7]"
                  >
                    <option value="" className="bg-[#0D1117]">
                      Select condition
                    </option>
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond} className="bg-[#0D1117]">
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="yearsUsed"
                    className="block text-sm font-medium mb-2"
                  >
                    Years Used
                  </label>
                  <input
                    type="number"
                    id="yearsUsed"
                    value={yearsUsed}
                    onChange={(e) => setYearsUsed(e.target.value)}
                    min="0"
                    max="50"
                    className="w-full bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] outline-none"
                  />
                </div>
              </div>

              {/* Negotiable */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="w-4 h-4 rounded border-[#30363D] bg-black/30 text-[#7ADAA5] focus:ring-[#7ADAA5]"
                />
                <label htmlFor="negotiable" className="text-sm font-medium">
                  Price is negotiable
                </label>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] outline-none"
                  maxLength={1000}
                />
                <p className="text-xs text-[#ECECBB]/50 mt-1">
                  {description.length}/1000 characters
                </p>
              </div>

              {/* Specifications */}
              <div>
                <label
                  htmlFor="specifications"
                  className="block text-sm font-medium mb-2"
                >
                  Specifications (Optional)
                </label>
                <textarea
                  id="specifications"
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  rows={3}
                  className="w-full bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] outline-none"
                  maxLength={1000}
                />
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-black/20 border border-[#30363D] p-6 rounded-lg">
            <h2 className="text-lg font-bold border-b border-[#30363D] pb-4 mb-6">
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium mb-2"
                >
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium mb-2"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Shipping Options Card */}
          <div className="bg-black/20 border border-[#30363D] p-6 rounded-lg">
            <h2 className="text-lg font-bold border-b border-[#30363D] pb-4 mb-6">
              Shipping Options
            </h2>
            <div className="flex flex-wrap gap-3">
              {["local pickup", "nationwide shipping", "meetup"].map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleShippingToggle(option)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      shippingOptions.includes(option)
                        ? "bg-[#7ADAA5]/20 border-[#7ADAA5] text-[#7ADAA5]"
                        : "border-[#30363D] text-[#ECECBB]/70 hover:border-[#ECECBB]/50"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Photos Card */}
          <div className="bg-black/20 border border-[#30363D] p-6 rounded-lg">
            <h2 className="text-lg font-bold border-b border-[#30363D] pb-4 mb-6">
              Photos <span className="text-red-400">*</span>
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Add Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-[#239BA7] text-white rounded-md hover:bg-[#239BA7]/80"
                >
                  Add
                </button>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-[#1e293b] rounded-lg overflow-hidden">
                      <img
                        src={img}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.png";
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 text-xs bg-black/70 px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-8 py-3 border border-red-500/50 text-red-400 font-bold rounded-lg hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
            >
              <FiTrash2 /> Delete Listing
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 border border-[#30363D] text-[#ECECBB] font-bold rounded-lg hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#7ADAA5] text-black font-bold rounded-lg hover:bg-[#7ADAA5]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
