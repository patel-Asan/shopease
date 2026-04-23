import axios from "axios";
import { toast } from "react-toastify";

// Base API URL - Make sure to include /api
const BASE = import.meta.env.VITE_API_BASE 
  ? import.meta.env.VITE_API_BASE.includes('/api') 
    ? import.meta.env.VITE_API_BASE 
    : import.meta.env.VITE_API_BASE + '/api'
  : "https://shopease-511p.onrender.com/api";

// Cloudinary Config
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";

// Helper to get Cloudinary image URL
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path; // Already full URL
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${path}`;
};

// Generate initials avatar (local, no external dependencies)
export const getInitialsAvatar = (name, background = "c9a962", color = "ffffff", size = 128) => {
  const initials = (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="100%" height="100%" fill="#${background}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}px" font-weight="bold" fill="#${color}" 
          text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
 
// Axios instance
const API = axios.create({
  baseURL: BASE,
  withCredentials: true, // send cookies automatically
});
 
// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
 
// Response interceptor for 401 / 403 errors
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);
    
    // Mark that toast has been shown to avoid duplicates
    originalRequest._toastShown = true;
 
    const status = error.response?.status;
 
    // Forbidden / blocked user
    if (status === 403) {
      toast.error(error.response.data?.message || "Access forbidden");
      return Promise.reject(error);
    }
 
    // Token expired (but skip for auth endpoints like login)
    if (status === 401 && !originalRequest._retry && !originalRequest._skipRefresh) {
      originalRequest._retry = true;
      try {
        const { data } = await API.post("/auth/refresh"); // cookies sent automatically
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return API(originalRequest);
        }
      } catch (_) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        toast.info("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
 
    return Promise.reject(error);
  }
);
 
// Helper function for requests
export const apiFetch = async (url, options = {}) => {
  try {
    const { method = "GET", body, headers = {} } = options;
    const config = { url, method, data: body, headers: { ...headers } };
    if (body instanceof FormData) delete config.headers["Content-Type"];
    config._skipRefresh = true;
    const response = await API(config);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: "Network error. Please try again." };
  }
};
 

//////////////////////////
// NEWSLETTER APIs
//////////////////////////
export const subscribeNewsletter = (email) => 
  apiFetch("/newsletter/subscribe", { 
    method: "POST", 
    body: { email } 
  });

export const validateCoupon = (couponCode, totalAmount) => 
  apiFetch("/newsletter/validate-coupon", { 
    method: "POST", 
    body: { couponCode, totalAmount } 
  });

export const getUserDiscounts = () => 
  apiFetch("/newsletter/my-discounts");

//////////////////////////
// PRODUCT APIs
//////////////////////////
export const getProducts = () => apiFetch("/products");
export const getProductById = (id) => apiFetch(`/products/${id}`);

// ✅ Trending Products
export const getTrendingProducts = () => apiFetch("/products/trending/all");

// ✅ Product Reviews
export const getProductReviews = (productId) => 
  apiFetch(`/products/${productId}/reviews`);

export const addReview = (productId, data) => 
  apiFetch(`/products/${productId}/reviews`, { 
    method: 'POST', 
    body: data 
  });

export const updateReview = (productId, reviewId, data) => 
  apiFetch(`/products/${productId}/reviews/${reviewId}`, { 
    method: 'PUT', 
    body: data 
  });

export const deleteReview = (productId, reviewId) => 
  apiFetch(`/products/${productId}/reviews/${reviewId}`, { 
    method: 'DELETE' 
  });

// ✅ Related Products
export const getRelatedProducts = (category, excludeProductId) => 
  apiFetch(`/products/related/${category}?exclude=${excludeProductId}`);

// ✅ Add Product (Admin)
export const addProduct = (formData) =>
  apiFetch("/products/add", { method: "POST", body: formData });

// ✅ Update Product (Admin)
export const updateProduct = (id, formData) =>
  apiFetch(`/products/update/${id}`, { method: "PUT", body: formData });

// ✅ Delete Product (Admin)
export const deleteProduct = (id) =>
  apiFetch(`/products/delete/${id}`, { method: "DELETE" });

//////////////////////////
// Cart APIs
//////////////////////////
export const getCart = () => apiFetch("/cart");
export const addToCart = (productId, quantity = 1) =>
  apiFetch("/cart/add", { method: "POST", body: { productId, quantity } });
export const removeFromCart = (productId) =>
  apiFetch("/cart/remove", { method: "POST", body: { productId } });
 
//////////////////////////
// Order APIs
//////////////////////////

export const createOrder = (paymentMethod, addressId, couponCode = null) =>
  apiFetch("/orders/create", { method: "POST", body: { paymentMethod, addressId, couponCode } });
export const getUserOrders = () => apiFetch("/orders");
export const cancelOrder = (orderId) => apiFetch(`/orders/cancel/${orderId}`, { method: "PATCH" });
 
 
 
 
 
//////////////////////////
// Delivery Boy APIs (Admin)
//////////////////////////
export const getAllDeliveryBoys = () => apiFetch("/admin/users/delivery"); 
// GET all delivery boys
export const createDeliveryBoy = (data) =>
  apiFetch("/admin/users/delivery/create", { method: "POST", body: data }); // { username, email, password }
export const deleteDeliveryBoy = (id) =>
  apiFetch(`/admin/users/${id}`, { method: "DELETE" });
export const toggleBlockDeliveryBoy = (id) =>
  apiFetch(`/admin/users/block/${id}`, { method: "PATCH" });
 
 
 
 
// Admin APIs
export const getAllOrders = () => apiFetch("/orders/admin/all");
export const updateOrderStatus = (orderId, status) =>
  apiFetch(`/orders/admin/update/${orderId}`, { method: "PATCH", body: { status } });

// Payment APIs
export const generateQRCode = (data) =>
  apiFetch("/payments/generate-qr", { method: "POST", body: data });
export const verifyPayment = (orderId) =>
  apiFetch(`/payments/verify-upi?orderId=${orderId}`);
export const getPaymentConfig = () =>
  apiFetch("/payments/config");

export default API;
 
 
 