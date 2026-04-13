const router = require("express").Router();
const { auth, adminAuth, deliveryAuth } = require("../middleware/auth");
const { uploadProduct } = require("../middleware/upload");
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

const productController = require("../controllers/productController");

// ==================== PRODUCT ROUTES ====================

// Public routes
router.get("/", productController.getProducts);
router.get("/trending/all", productController.getTrendingProducts);
router.get("/related/:category", productController.getRelatedProducts);
router.get("/:id", productController.getProductById);

// Review routes
router.get("/:id/reviews", productController.getProductReviews);
router.post("/:id/reviews", auth, productController.addReview);
router.put("/:productId/reviews/:reviewId", auth, productController.updateReview);
router.delete("/:productId/reviews/:reviewId", auth, productController.deleteReview);

// Admin routes - Cloudinary upload
router.post("/add", 
  auth, 
  adminAuth, 
  uploadProduct.array('productImages', 5),
  productController.createProduct
);

router.put("/update/:id", 
  auth, 
  adminAuth, 
  uploadProduct.array('productImages', 5),
  productController.updateProduct
);

router.delete("/delete/:id", 
  auth, 
  adminAuth, 
  productController.deleteProduct
);

// ==================== ORDER ROUTES ====================

// User routes
router.post("/orders/create", auth, createOrder);
router.get("/orders", auth, getOrders);
router.patch("/orders/cancel/:id", auth, cancelOrder);
 
// Admin routes
router.get("/orders/admin/all", auth, adminAuth, getAllOrders);
router.patch("/orders/admin/update/:id", auth, adminAuth, updateOrderStatus);
router.patch("/orders/admin/assign/:id", auth, adminAuth, assignDeliveryBoy);
 
// Delivery routes
router.get("/orders/delivery/my", auth, deliveryAuth, getMyDeliveryOrders);
router.patch("/orders/delivery/delivered/:id", auth, deliveryAuth, markDelivered);

module.exports = router;
