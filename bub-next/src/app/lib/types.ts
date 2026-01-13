// Type definitions for the Barely Used Bytes application

export interface Location {
  city: string;
  country: string;
}

export interface Product {
  productId: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  currency: string;
  condition: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  location: Location;
  status: string;
  specifications: string;
  yearsUsed: number;
  negotiable: boolean;
  shippingOptions: string[];
  postedAt: string;
  updatedAt: string;
  views: number;
}

export interface ProductCreate {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  currency: string;
  condition: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  location: Location;
  status: string;
  specifications: string;
  yearsUsed: number;
  negotiable: boolean;
  shippingOptions: string[];
}

export interface Address {
  street?: string;
  city: string;
  zipCode?: string;
  country: string;
}

export interface User {
  userId: string;
  email: string;
  displayName: string;
  profilePictureUrl?: string;
  phoneNumber?: string;
  address?: Address;
  roles: string[];
  bio?: string;
  rating: number;
  totalReviews: number;
  isVerifiedSeller: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserCreate {
  email: string;
  displayName: string;
  profilePictureUrl?: string;
  phoneNumber?: string;
  address?: Address;
  roles?: string[];
  bio?: string;
  rating?: number;
  totalReviews?: number;
  isVerifiedSeller?: boolean;
}

export interface ShippingAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Order {
  orderId: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalAmount: number;
  currency: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: ShippingAddress;
  shippingTrackingNumber?: string;
  sellerNotes?: string;
  buyerNotes?: string;
  reviewId?: string;
  orderedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface Review {
  reviewId: string;
  productId: string;
  sellerId: string;
  reviewerId: string;
  orderId: string;
  rating: number;
  comment: string;
  productName: string;
  sellerName: string;
  reviewerName: string;
  isApproved: boolean;
  helpfulVotes: number;
  reviewedAt: string;
}

// Categories for the sidebar and filtering
export const CATEGORIES = [
  { name: "CPUs", slug: "cpu", subcategories: ["Intel", "AMD", "ARM"] },
  { name: "GPUs", slug: "gpu", subcategories: ["NVIDIA", "AMD", "Intel"] },
  {
    name: "Motherboards",
    slug: "motherboard",
    subcategories: ["ATX", "Micro-ATX", "Mini-ITX"],
  },
  { name: "RAM", slug: "ram", subcategories: ["DDR4", "DDR5"] },
  { name: "Storage", slug: "storage", subcategories: ["SSD", "HDD", "NVMe"] },
  {
    name: "Power Supplies",
    slug: "psu",
    subcategories: ["Modular", "Semi-Modular", "Non-Modular"],
  },
  {
    name: "Cases",
    slug: "case",
    subcategories: ["Full Tower", "Mid Tower", "Mini Tower"],
  },
  {
    name: "Cooling",
    slug: "cooling",
    subcategories: ["Air Cooler", "AIO", "Custom Loop"],
  },
] as const;

export const CONDITIONS = [
  "Like New",
  "Excellent",
  "Good",
  "Fair",
  "For Parts",
] as const;

export const CURRENCIES = ["BDT", "USD", "EUR", "GBP"] as const;

// Cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Wishlist context types
export interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

// Cart context types
export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
