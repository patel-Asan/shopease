// models/NewsletterDiscount.js - CORRECTED VERSION
const mongoose = require('mongoose');

const newsletterDiscountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  couponCode: {
    type: String,
    required: true,
    unique: true, // ✅ This automatically creates an index
    uppercase: true, // Add this to standardize coupon codes
    trim: true
  },
  discountPercentage: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: {
    type: Number
  }
});

// ✅ Only create compound indexes for query optimization
// Remove the individual couponCode index since unique: true already creates it
newsletterDiscountSchema.index({ userId: 1, createdAt: -1 });
newsletterDiscountSchema.index({ isUsed: 1, expiryDate: 1 }); // For cleanup jobs

module.exports = mongoose.model('NewsletterDiscount', newsletterDiscountSchema);