const mongoose = require("mongoose");
 
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  price: Number,
});
 
// Add discount schema
const discountAppliedSchema = new mongoose.Schema({
  code: String,
  percentage: Number,
  amount: Number
}, { _id: false }); // _id: false because we don't need separate ID for this subdocument
 
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [orderItemSchema],
  
  // Original total before discount
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Final total after discount
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Discount information
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
 
  assignedAt: Date,
  deliveredAt: Date,
 
  paymentMethod: {
    type: String,
    enum: ["COD", "UPI", "Card"],
    default: "COD"
  },
 
  shippingAddress: Object
}, { timestamps: true });
 
module.exports = mongoose.model("Order", orderSchema);