  
const router = require("express").Router();
const { 
  login, 
  register, 
  refreshToken, 
  updateProfile, 
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  testEmail
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const { uploadProfile } = require("../middleware/upload");
 
// Existing routes
router.post("/register", uploadProfile.single("profileImage"), register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.put("/update-profile", auth, uploadProfile.single("profileImage"), updateProfile);
router.post("/logout", logout);
 
// NEW Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

// Test email configuration
router.post("/test-email", testEmail);

module.exports = router;
 
 
 