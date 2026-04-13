const router = require("express").Router();
const { auth, adminAuth } = require("../middleware/auth");
const {
  getAllUsers,
  getAllDeliveryBoys,
  createDeliveryBoy,
  deleteUser,
  toggleBlockUser,
  updateUserRole,
} = require("../controllers/adminUserController");
 
// Users routes
router.get("/", auth, adminAuth, getAllUsers);
router.delete("/:id", auth, adminAuth, deleteUser);
router.patch("/block/:id", auth, adminAuth, toggleBlockUser);
router.patch("/role/:id", auth, adminAuth, updateUserRole);
 
// Delivery Boy routes
router.get("/delivery", auth, adminAuth, getAllDeliveryBoys); // ✅ handler exists
router.post("/delivery/create", auth, adminAuth, createDeliveryBoy); // ✅ handler exists
 
module.exports = router;