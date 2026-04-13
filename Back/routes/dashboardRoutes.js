// routes/dashboardRoutes.js
const router = require("express").Router();
const { auth, adminAuth } = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/dashboardController");
 
// Only admin can access
router.get("/", auth, adminAuth, getDashboardStats);
 
module.exports = router;
 
 