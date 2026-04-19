const User = require("../models/User");
const Session = require("../models/Session");
const Order = require("../models/Order");
const Product = require("../models/Product");

const getPublicStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const completedOrders = await Order.countDocuments({ status: "delivered" });
    
    const revenueAggregation = await Order.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    
    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;
    
    const ordersWithRating = await Order.find({ rating: { $exists: true, $ne: null } });
    let avgRating = 0;
    if (ordersWithRating.length > 0) {
      const totalRating = ordersWithRating.reduce((sum, order) => sum + order.rating, 0);
      avgRating = (totalRating / ordersWithRating.length).toFixed(1);
    }
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      avgRating: avgRating > 0 ? avgRating : "4.9"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch public stats" });
  }
};
 
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
 
    // Count sessions active in last 15 min
    const fifteenMinutesAgo = new Date(Date.now() - 25 * 60 * 1000);
    const activeSessions = await Session.countDocuments({
      lastActivity: { $gte: fifteenMinutesAgo },
    });
 
    // Count total orders
    const totalOrders = await Order.countDocuments();
 
    // Sum total revenue
    const revenueAggregation = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
 
    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;
 
    res.json([
      { title: "Total Users", value: totalUsers.toString(), color: "#ff6b6b" },
      { title: "Active Sessions", value: activeSessions.toString(), color: "#6bc1ff" },
      { title: "Total Orders", value: totalOrders.toString(), color: "#ff9800" },
      { title: "Total Revenue", value: `₹ ${totalRevenue.toLocaleString()}`, color: "#4caf50" }, // ✅ new card
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
 
module.exports = { getDashboardStats, getPublicStats };
 