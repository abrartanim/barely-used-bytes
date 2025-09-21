import { FC } from "react";
import ProductCard from "../ProductCard"; // Adjust path if needed
import { products } from "./mockData"; // Adjust path to your data file

const ProductPage: FC = () => {
  return (
    <div className=" min-h-screen p-6 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center md:text-left">
          Featured Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Map through the products and pass the props directly */}
          {products.map((product, index) => (
            <ProductCard
              key={index} // Using index as key since no unique ID is available
              name={product.name}
              price={product.price}
              condition={product.condition}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
