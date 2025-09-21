import { notFound } from "next/navigation";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
// Make sure this import path correctly points to your mockData file
import { products } from "../../../components/pages/mockData";

// Color Palette
const colors = {
  green: "#7ADAA5",
  teal: "#239BA7",
  cream: "#ECECBB",
  gold: "#E1AA36",
};

// This function tells Next.js which slugs to pre-render at build time.
// This helps resolve dynamic parameter issues and improves performance.
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Define a type for the component's props for clarity
type ProductDetailPageProps = {
  params: {
    slug: string;
  };
};

// Helper function to find a product by its slug
async function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

// Use the new props type in the function signature
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    // The main background is inherited from globals.css. Default text color is set to cream.
    <div className="min-h-screen p-4 sm:p-8" style={{ color: colors.cream }}>
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumbs */}
        <div className="text-sm mb-4">
          <a
            href="#"
            style={{ color: colors.teal }}
            className="hover:underline"
          >
            Components
          </a>
          <span className="text-gray-400"> / </span>
          <a
            href="#"
            style={{ color: colors.teal }}
            className="hover:underline"
          >
            Processors
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side: Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-[#1e293b] rounded-lg p-4 mb-4 flex items-center justify-center aspect-square">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={400}
                className="object-contain max-h-full max-w-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div
                className="bg-[#1e293b] rounded-lg p-2 border-2"
                style={{ borderColor: colors.green }}
              >
                <Image
                  src={product.imageUrl}
                  alt="thumbnail 1"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <div className="bg-[#1e293b] rounded-lg p-2 opacity-60 cursor-pointer">
                <Image
                  src={product.imageUrl}
                  alt="thumbnail 2"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <div className="bg-[#1e293b] rounded-lg p-2 opacity-60 cursor-pointer">
                <Image
                  src={product.imageUrl}
                  alt="thumbnail 3"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-400 mb-6 text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
              perspiciatis unde omnis iste natus error sit voluptatem.
            </p>

            <div className="bg-[#1e293b] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Condition</span>
                  <span
                    className="font-semibold"
                    style={{ color: colors.green }}
                  >
                    {product.condition.replace("Used, ", "")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Price</span>
                  <span
                    className="font-bold text-2xl"
                    style={{ color: colors.cream }}
                  >
                    {product.price}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                className="text-slate-900 font-bold py-3 px-6 rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: colors.green }}
              >
                Buy Now
              </button>
              <button
                className="font-bold py-3 px-6 rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: colors.teal, color: colors.cream }}
              >
                Make an Offer
              </button>
            </div>

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
                  <p className="font-semibold">Sophia Clark</p>
                  <div className="flex items-center text-sm text-gray-400">
                    <FaStar className="mr-1" style={{ color: colors.gold }} />
                    4.8 (126 reviews)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Specifications */}
        <div className="mt-12 bg-[#1e293b] rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Specifications</h2>
          <p className="text-gray-400 leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
        </div>
      </div>
    </div>
  );
}
