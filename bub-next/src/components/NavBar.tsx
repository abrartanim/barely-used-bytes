import React from "react";
import { FaSearch, FaRegHeart, FaShoppingCart } from "react-icons/fa";

export default function NavBar() {
  return (
    <div>
      <nav className="flex items-center justify-between bg-[#1a2e2e] px-8 py-4">
        <div className="flex items-center ">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for components"
              className="w-96 rounded-md border-none bg-[#0f1e1e] py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-6">
          <a href="#" className=" text-gray-300 hover:text-white">
            Browse
          </a>
          <a href="#" className=" text-gray-300 hover:text-white">
            Sell
          </a>
          <button
            type="button"
            className=" text-gray-300 hover:text-white cursor-pointer"
          >
            <FaRegHeart></FaRegHeart>
          </button>
          <button
            type="button"
            className=" text-gray-300 hover:text-white cursor-pointer"
          >
            <FaShoppingCart size={22}></FaShoppingCart>
          </button>

          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      </nav>
    </div>
  );
}
