const mongoose = require("mongoose");
 
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  price: Number,
  name: String,
  image: String
});
 
const discountAppliedSchema = new mongoose.Schema({
  code: String,
  percentage: Number,
  amount: Number
}, { _id: false });
 
const trackingHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { _id: true });
 
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discountApplied: {
    type: discountAppliedSchema,
    default: null
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Out Of Delivery",
      "Delivered",
      "Cancelled"
    ],
    default: "Pending"
  },
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  deliveryBoyName: String,
  deliveryBoyPhone: String,
  assignedAt: Date,
  deliveredAt: Date,
  estimatedDelivery: Date,
  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "QR Generated", "Initiated", "Paid", "Failed"],
    default: "Pending"
  },
  qrOrderId: {
    type: String,
    default: null
  },
  qrCodeSent: {
    type: Boolean,
    default: false
  },
  shippingAddress: {
    name: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  otp: {
    code: String,
    expiresAt: Date,
    verified: { type: Boolean, default: false },
    requestedAt: Date
  },
  trackingHistory: [trackingHistorySchema]
}, { timestamps: true });
 
module.exports = mongoose.model("Order", orderSchema);