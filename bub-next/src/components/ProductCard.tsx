import { FC } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";

// Interface updated to match the keys in mockData.ts
interface ProductCardProps {
  name: string;
  price: string;
  condition: string;
  imageUrl: string;
}

const ProductCard: FC<ProductCardProps> = ({
  name,
  price,
  condition,
  imageUrl,
}) => {
  return (
    <div className=" rounded-2xl shadow-md overflow-hidden w-full border border-gray-700 group transition-all duration-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-400/20">
      <div className="relative h-48 w-full  flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          width={200}
          height={200}
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate">
          {name}
        </h3>
        <p className="text-emerald-400 font-bold text-xl mb-3">{price}</p>
        <div className="flex items-center text-sm text-gray-400">
          <FaStar className="text-yellow-400 mr-1.5" />
          {condition}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
