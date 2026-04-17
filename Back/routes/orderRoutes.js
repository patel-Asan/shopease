
const router = require("express").Router();
const { auth, adminAuth, deliveryAuth } = require("../middleware/auth");
const {
  createOrder,
  getOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  assignDeliveryBoy,
  getMyDeliveryOrders,
  markDelivered,
  requestDeliveryOtp,
  verifyDeliveryOtp
} = require("../controllers/orderController");
const { createNotification } = require("../controllers/notificationController");
 
// User routes
router.post("/create", auth, createOrder);
router.get("/", auth, getOrders);
router.patch("/cancel/:id", auth, cancelOrder);
router.post("/:id/request-otp", auth, requestDeliveryOtp);
 
// Admin routes
router.get("/admin/all", auth, adminAuth, getAllOrders);
router.patch("/admin/update/:id", auth, adminAuth, updateOrderStatus);
router.patch("/admin/assign/:id", auth, adminAuth, assignDeliveryBoy);
 
// Delivery routes
router.get("/delivery/my", auth, deliveryAuth, getMyDeliveryOrders);
router.patch("/delivery/verify-otp/:id", auth, deliveryAuth, verifyDeliveryOtp);
router.patch("/delivery/delivered/:id", auth, deliveryAuth, markDelivered);
 
module.exports = router;