import type { NextPage } from "next";
import { FiUploadCloud } from "react-icons/fi";

const CreateListingPage: NextPage = () => {
  return (
    // Main content area wrapper
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#ECECBB]">
      <div className="max-w-3xl mx-auto">
        {/* Page Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Create a New Listing</h1>
          <p className="mt-2 text-md text-[#ECECBB]/70">
            Fill out the details below to sell your hardware.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-8">
          {/* Product Details Card */}
          <div className="bg-black/20 border border-[#30363D] p-6 rounded-lg">
            <h2 className="text-lg font-bold border-b border-[#30363D] pb-4 mb-6">
              Product Details
            </h2>
            <div className="space-y-6">
              {/* Product Name Input */}
              <div>
                <label
                  htmlFor="product-name"
                  className="block text-sm font-medium mb-2"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="product-name"
                  className="w-full bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] focus:border-[#239BA7] outline-none placeholder:text-[#ECECBB]/40"
                  placeholder="e.g., NVIDIA GeForce RTX 3080"
                />
              </div>

              {/* Category and Price Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full appearance-none rounded-lg border border-[#7ADAA5]/30 bg-[#7ADAA5]/10 px-3 py-2 backdrop-blur-sm outline-none focus:border-[#7ADAA5] focus:ring-2 focus:ring-[#7ADAA5]"
                  >
                    <option className="bg-[#0D1117]">Select a category</option>
                    <option className="bg-[#0D1117]">CPU</option>
                    <option className="bg-[#0D1117]">GPU</option>
                    <option className="bg-[#0D1117]">Motherboard</option>
                    <option className="bg-[#0D1117]">RAM</option>
                    <option className="bg-[#0D1117]">Storage</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium mb-2"
                  >
                    Price
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-[#ECECBB]/40 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      className="w-full pl-7 bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] focus:border-[#239BA7] outline-none placeholder:text-[#ECECBB]/40"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Description Textarea */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full bg-black/30 border border-[#30363D] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#239BA7] focus:border-[#239BA7] outline-none placeholder:text-[#ECECBB]/40"
                  placeholder="Describe the condition, features, and any other relevant details about the product."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Photo Upload Card */}
          <div className="bg-black/20 border border-[#30363D] p-6 rounded-lg">
            <h2 className="text-lg font-bold border-b border-[#30363D] pb-4 mb-6">
              Photos
            </h2>
            <div className="border-2 border-dashed border-[#30363D] rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiUploadCloud className="w-12 h-12 text-[#E1AA36]" />
              </div>
              <h3 className="mb-2 font-semibold">Drag and drop photos here</h3>
              <p className="text-xs text-[#ECECBB]/60">
                or click to upload. Show the product from different angles.
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-[#239BA7] text-[#ECECBB] text-sm font-medium rounded-md hover:bg-[#239BA7]/90 transition-colors"
              >
                Upload Photos
              </button>
            </div>
          </div>

          {/* Form Submission Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-[#7ADAA5] text-black font-bold rounded-lg hover:bg-[#7ADAA5]/90 transition-all"
            >
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateListingPage;
