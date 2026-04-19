// routes/dashboardRoutes.js
const router = require("express").Router();
const { auth, adminAuth } = require("../middleware/auth");
const { getDashboardStats, getPublicStats } = require("../controllers/dashboardController");
 
// Public stats for landing page (no auth required)
router.get("/public", getPublicStats);
 
// Only admin can access
router.get("/", auth, adminAuth, getDashboardStats);
 
module.exports = router;
 
 