import { products } from "../../components/pages/mockData";

const UserProfilePage = () => {
  // Use the first 4 products from the mock data
  const userListings = products.slice(0, 4);

  return (
    <main className="flex flex-1 justify-center py-5 px-4 sm:px-10 text-stone-100">
      <div className="w-full max-w-5xl">
        {/* Profile Header Section */}
        <div className="bg-black/20 rounded-xl p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-6">
              <img
                src="https://i.pravatar.cc/128" // Increased size for better visibility
                alt="User Avatar"
                className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-full object-cover border-2 border-stone-700"
              />
              <div className="flex flex-col justify-center gap-1">
                <h1 className="text-2xl font-bold">TechSavvySarah</h1>
                <p className="text-stone-400 max-w-md">
                  Avid PC builder and tech enthusiast. Selling high-quality used
                  components to fellow enthusiasts.
                </p>
                <p className="text-sm text-stone-500">Joined in 2021</p>
              </div>
            </div>
            <button className="flex-shrink-0 cursor-pointer rounded-lg h-10 px-6 bg-[#007562] text-white text-sm font-bold shadow-sm hover:bg-[#239BA7]/90 w-full sm:w-auto">
              Edit Profile
            </button>
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
          <h2 className="px-4 text-xl font-bold">Current Listings</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
            {userListings.map((product) => (
              <a key={product.slug} href="#" className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-stone-800">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <h3 className="mt-4 text-sm font-bold text-white">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-stone-400">
                  {product.condition}
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {product.price}
                </p>
              </a>
            ))}
          </div>

          {/* Pagination */}
          <nav
            aria-label="Pagination"
            className="mt-8 flex items-center justify-center gap-2"
          >
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-800"
            >
              {/* Previous Page Icon */}
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#239BA7] text-white text-sm font-bold"
            >
              1
            </a>
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm text-stone-400 hover:bg-stone-800"
            >
              2
            </a>
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm text-stone-400 hover:bg-stone-800"
            >
              3
            </a>
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-800"
            >
              {/* Next Page Icon */}
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;
