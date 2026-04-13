
const router = require("express").Router();
const { auth, adminAuth ,deliveryAuth  } = require("../middleware/auth");
const {
  createOrder,
  getOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  assignDeliveryBoy,
  getMyDeliveryOrders,
  markDelivered,
} = require("../controllers/orderController");
const { createNotification } = require("../controllers/notificationController");
 
// User routes
router.post("/create", auth, createOrder);
router.get("/", auth, getOrders);
router.patch("/cancel/:id", auth, cancelOrder);
 
// Admin routes
router.get("/admin/all", auth, adminAuth, getAllOrders);
router.patch("/admin/update/:id", auth, adminAuth, updateOrderStatus);
// Admin assign delivery
router.patch(
  "/admin/assign/:id",
  auth,
  adminAuth,
  assignDeliveryBoy
);
 
// Delivery routes
router.get(
  "/delivery/my",
  auth,
  deliveryAuth,
  getMyDeliveryOrders
);
 
router.patch(
  "/delivery/delivered/:id",
  auth,
  deliveryAuth,
  markDelivered
);

// Test endpoint - create order WITH notification (to test if notification works)
router.post("/create-with-notification", auth, async (req, res) => {
  try {
    const Order = require("../models/Order");
    const { createNotification } = require("../controllers/notificationController");
    
    console.log("🧪 TEST: Creating order with notification...");
    
    // Create a test order
    const order = new Order({
      user: req.user._id,
      items: [{ product: null, quantity: 1, price: 100 }],
      subtotal: 100,
      totalAmount: 100,
      paymentMethod: "COD",
      shippingAddress: { name: "Test", phone: 1234567890 },
      status: "Confirmed"
    });
    
    await order.save();
    
    console.log("🧪 Order created:", order._id);
    
    // Create notification
    const notification = await createNotification({
      role: "admin",
      type: "NEW_ORDER",
      title: "TEST ORDER - New Order",
      message: `Test order #${order._id.slice(-6)} created`,
      link: "/admin/orders"
    });
    
    console.log("🧪 Notification created:", notification?._id);
    
    res.json({ success: true, orderId: order._id, notificationId: notification?._id });
  } catch (error) {
    console.error("🧪 TEST ERROR:", error);
    res.status(500).json({ message: "Test failed: " + error.message });
  }
});

module.exports = router;