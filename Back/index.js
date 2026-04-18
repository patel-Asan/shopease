require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
 
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
 
const app = express();
connectDB();
 
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://shopease-3tglmrhgr-asans-projects-69ce1902.vercel.app";

app.use(cors({ 
  origin: ["https://shopease-3tglmrhgr-asans-projects-69ce1902.vercel.app", "http://localhost:5173", "http://localhost:3000"], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional for form submissions
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
 
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/notifications", notificationRoutes);
 
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: err.message });
});
 
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));