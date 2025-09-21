"use client";

// Import React and necessary icons from the 'react-icons/fa' (Font Awesome) module.
// 'react-icons' is a versatile library that includes many popular icon sets.
// You'll need to install it in your project: npm install react-icons
import React from "react";
import { FaSearch, FaRegHeart, FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  return (
    // The main <nav> container.
    // - `flex`: Enables Flexbox layout.
    // - `items-center`: Aligns children vertically to the center.
    // - `justify-between`: Distributes space between the left and right sections.
    // - `bg-[#1a2e2e]`: Sets a custom dark teal background color.
    // - `px-8 py-4`: Adds horizontal (padding-x) and vertical (padding-y) padding.
    <nav className="flex items-center justify-between bg-[#1a2e2e] px-8 py-4">
      {/* Left side of the navbar */}
      <div className="flex items-center">
        {/* Container for the search bar. 'relative' allows absolute positioning of the icon inside it. */}
        <div className="relative">
          {/* Search icon from Font Awesome.
            - `absolute`: Positions the icon relative to the parent div.
            - `left-3`: Places the icon 3 units from the left.
            - `top-1/2 -translate-y-1/2`: A trick to perfectly center the icon vertically.
            - `text-gray-400`: Sets the icon color.
          */}
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          {/* The search input field. */}
          <input
            type="text"
            placeholder="Search for components..."
            // `w-96`: Sets a fixed width.
            // `bg-[#0f1e1e]`: Sets a slightly darker background for the input.
            // `text-white placeholder-gray-400`: Sets text and placeholder text colors.
            // `rounded-md`: Applies a medium border-radius.
            // `py-2 pl-10 pr-4`: Adds padding. `pl-10` makes space for the icon on the left.
            // `focus:outline-none focus:ring-2 focus:ring-teal-500`: Styles for when the input is focused.
            className="w-96 rounded-md border-none bg-[#0f1e1e] py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Right side of the navbar */}
      {/* - `flex items-center`: Aligns all items in this section.
        - `gap-x-6`: Adds a horizontal gap of 6 units between each child item.
      */}
      <div className="flex items-center gap-x-6">
        {/* Navigation links with a hover effect. */}
        <a href="#" className="text-gray-300 hover:text-white">
          Browse
        </a>
        <a href="#" className="text-gray-300 hover:text-white">
          Sell
        </a>

        {/* Wishlist icon button. Using FaRegHeart for an outlined heart. */}
        <button type="button" className="text-gray-300 hover:text-white">
          <FaRegHeart size={22} />
        </button>

        {/* Shopping cart icon button. */}
        <button type="button" className="text-gray-300 hover:text-white">
          <FaShoppingCart size={22} />
        </button>

        {/* User profile avatar.
          - `h-10 w-10`: Sets the height and width.
          - `rounded-full`: Makes the image a perfect circle.
          - `object-cover`: Ensures the image covers the area without being stretched.
        */}
        <img
          src="https://i.pravatar.cc/40" // Using a placeholder image for the avatar.
          alt="User Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
    </nav>
  );
}
