
const router = require("express").Router();
const { auth, adminAuth } = require("../middleware/auth");
const { uploadProfile } = require("../middleware/upload");
const { updateProfile } = require("../controllers/userController");
const { getUserProfile } = require("../controllers/userController");
const { addAddress, updateAddress, deleteAddress } = require("../controllers/userController");
 
router.post("/address/add", auth, addAddress);
router.patch("/address/update/:id", auth, updateAddress);
router.delete("/address/delete/:id", auth, deleteAddress);
 
router.put(
  "/update-profile",
  auth,
  uploadProfile.single("profileImage"),
  updateProfile
);
 
 
router.get("/", auth, getUserProfile);
 
 
module.exports = router;