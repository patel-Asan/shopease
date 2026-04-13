
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  role: {
    type: String,
    enum: ["admin", "delivery", "user", "all"],
    default: "all",
  },
  type: {
    type: String,
    enum: [
      "NEW_ORDER",
      "ORDER_CONFIRMED",
      "ORDER_STATUS_UPDATE",
      "ORDER_SHIPPED",
      "ORDER_DELIVERED",
      "ORDER_CANCELLED",
      "ORDER_OUT_FOR_DELIVERY",
      "PAYMENT_RECEIVED",
      "NEW_USER",
      "DELIVERY_ASSIGNED",
      "LOW_STOCK",
      "NEW_MESSAGE",
      "ACCOUNT_BLOCKED",
      "ACCOUNT_UNBLOCKED",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

notificationSchema.index({ role: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
