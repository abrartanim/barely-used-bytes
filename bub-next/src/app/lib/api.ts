// API service for interacting with the FastAPI backend

import {
  Product,
  ProductCreate,
  User,
  UserCreate,
  Order,
  Review,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  // Import dynamically to avoid SSR issues
  const { auth } = await import("./firebase");
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
}

// Helper function to create headers with auth
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Generic error handler
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
}

// ============ PRODUCT API ============

export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  return handleResponse<Product[]>(response);
}

export async function getProductById(productId: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`);
  return handleResponse<Product>(response);
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getAllProducts();
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery) ||
      p.subcategory.toLowerCase().includes(lowercaseQuery)
  );
}

export async function createProduct(product: ProductCreate): Promise<Product> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers,
    body: JSON.stringify(product),
  });
  return handleResponse<Product>(response);
}

export async function updateProduct(
  productId: string,
  product: Partial<ProductCreate>
): Promise<Product> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(product),
  });
  return handleResponse<Product>(response);
}

export async function deleteProduct(productId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `HTTP error! status: ${response.status}`
    );
  }
}

// ============ USER API ============

export async function getUserById(userId: string): Promise<User> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers,
  });
  return handleResponse<User>(response);
}

export async function createUser(user: UserCreate): Promise<User> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers,
    body: JSON.stringify(user),
  });
  return handleResponse<User>(response);
}

export async function updateUser(
  userId: string,
  user: Partial<UserCreate>
): Promise<User> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(user),
  });
  return handleResponse<User>(response);
}

// ============ ORDER API ============

export async function getOrders(): Promise<Order[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers,
  });
  return handleResponse<Order[]>(response);
}

export async function getOrderById(orderId: string): Promise<Order> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers,
  });
  return handleResponse<Order>(response);
}

export async function createOrder(
  order: Omit<Order, "orderId" | "orderedAt" | "shippedAt" | "deliveredAt">
): Promise<Order> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(order),
  });
  return handleResponse<Order>(response);
}

export async function updateOrder(
  orderId: string,
  order: Partial<Order>
): Promise<Order> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(order),
  });
  return handleResponse<Order>(response);
}

// ============ REVIEW API ============

export async function getAllReviews(): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/reviews`);
  return handleResponse<Review[]>(response);
}

export async function getReviewById(reviewId: string): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`);
  return handleResponse<Review>(response);
}

export async function getReviewsForSeller(sellerId: string): Promise<Review[]> {
  const reviews = await getAllReviews();
  return reviews.filter((r) => r.sellerId === sellerId);
}

export async function getReviewsForProduct(
  productId: string
): Promise<Review[]> {
  const reviews = await getAllReviews();
  return reviews.filter((r) => r.productId === productId);
}

export async function createReview(
  review: Omit<Review, "reviewId" | "reviewedAt">
): Promise<Review> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers,
    body: JSON.stringify(review),
  });
  return handleResponse<Review>(response);
}
