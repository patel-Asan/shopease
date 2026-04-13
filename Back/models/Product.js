// models/Product.js - Updated Schema
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // For discount display
  img: String, // Main image (existing)
  images: [String], // ✅ NEW: Multiple images array (Cloudinary URLs)
  imageIds: [String], // ✅ NEW: Cloudinary public IDs for deletion
  description: String,
  category: { type: String, default: "general" },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }, // ✅ NEW: Average rating
  
  // ✅ NEW: Reviews array
  reviews: [reviewSchema],
  
  // Existing fields
  totalOrders: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);