  
const mongoose = require("mongoose");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const { applyDiscountToOrder } = require("./newsletterController");
const { createNotification } = require("./notificationController");
const { sendDeliveryOtpEmail, sendOrderStatusEmail } = require("../Utils/emailService");



/**
 * @desc    Create a new order
 * @route   POST /api/orders/create
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const { paymentMethod, addressId, couponCode } = req.body;

    console.log("=== Order Create Request ===");
    console.log("paymentMethod:", paymentMethod);
    console.log("addressId:", addressId);
    console.log("couponCode:", couponCode);

    if (!paymentMethod)
      return res.status(400).json({ message: "Payment method required" });
    if (!addressId)
      return res.status(400).json({ message: "Shipping address required" });

    const user = await User.findById(req.user._id).populate("cart.product");

    console.log("User found:", !!user);
    console.log("Cart items:", user?.cart?.length || 0);

    if (!user || user.cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const address = user.addresses.id(addressId);
    console.log("Address found:", !!address);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const validCartItems = user.cart.filter((item) => item.product);
    if (!validCartItems.length)
      return res
        .status(400)
        .json({ message: "All products in cart are unavailable" });

    // Check stock
    for (let item of validCartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItems = validCartItems.map((item) => {
      const itemTotal = item.quantity * item.product.price;
      subtotal += itemTotal;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    let totalAmount = subtotal;
    let discountApplied = null;

    // Apply 10% discount if coupon code provided
    if (couponCode) {
      try {
        const discountResult = await applyDiscountToOrder(couponCode, req.user._id);
        
        // Calculate 10% discount
        const discountAmount = subtotal * 0.10; // 10% of subtotal
        totalAmount = subtotal - discountAmount;
        
        // Round to 2 decimal places
        totalAmount = Math.round(totalAmount * 100) / 100;
        
        discountApplied = {
          code: discountResult.couponCode,
          percentage: 10,
          amount: discountAmount
        };
        
        console.log(`=== Order Discount Applied ===`);
        console.log(`Subtotal: ₹${subtotal}`);
        console.log(`10% Discount: -₹${discountAmount}`);
        console.log(`Final Total: ₹${totalAmount}`);
        
      } catch (error) {
        return res.status(400).json({
          message: error.message
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      subtotal: subtotal,
      totalAmount: totalAmount,
      discountApplied: discountApplied,
      paymentMethod,
      shippingAddress: address.toObject(),
      status: "Confirmed",
    });

    // Reduce stock
    for (let item of validCartItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    user.cart = [];
    await user.save();

    // ========================================
    // CREATE NOTIFICATION FOR ADMIN (DIRECT)
    // ========================================
    const orderIdStr = order._id.toString();
    const orderNumber = orderIdStr.slice(-6);
    
    try {
      const notification = new Notification({
        role: "admin",
        type: "NEW_ORDER",
        title: "New Order Received",
        message: `Order #${orderNumber} placed by ${user.username} for ₹${totalAmount}`,
        link: "/admin?page=orders",
        metadata: { orderId: orderIdStr, userId: user._id.toString() }
      });
      
      await notification.save();
    } catch (error) {
      // Don't fail the order if notification fails
    }

    console.log("✅ Order created successfully:", order._id);

    res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

 
/**
 * @desc    Get orders of logged-in user
 * @route   GET /api/orders
 * @access  Private
 */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
 
    res.json({ status: "success", count: orders.length, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate("items.product")
      .populate("deliveryBoy", "username name phone");
 
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
 
    res.json({ status: "success", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};
 
/**
 * @desc    Cancel an order (user)
 * @route   PATCH /api/orders/cancel/:id
 * @access  Private
 */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
 
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled")
      return res.status(400).json({ message: "Order already cancelled" });
    if (order.status === "Delivered")
      return res
        .status(400)
        .json({ message: "Delivered order cannot be cancelled" });
 
    // Restore stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
 
    order.status = "Cancelled";
    await order.save();
    
    // Get user ID as string
    let userId;
    if (typeof order.user === 'object' && order.user._id) {
      userId = order.user._id.toString();
    } else if (typeof order.user === 'object' && order.user.toString) {
      userId = order.user.toString();
    } else {
      userId = order.user;
    }
  
    // Create notification for admin
    try {
      await createNotification({
        role: "admin",
        type: "ORDER_CANCELLED",
        title: "Order Cancelled",
        message: `Order #${order._id.toString().slice(-6)} has been cancelled`,
        link: `/admin?page=orders`,
        metadata: { orderId: order._id.toString(), userId: userId },
      });
    } catch (error) {
      // Don't fail order if notification fails
    }
  
    res.json({
      status: "success",
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};
 
/**
 * @desc    Admin - Get all orders
 * @route   GET /api/admin/orders
 * @access  Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product")
      .populate("deliveryBoy", "username name isBlocked") // ✅ ADD THIS
      .sort({ createdAt: -1 });
 
    res.json({ status: "success", count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
 
/**
 * @desc    Admin - Update order status
 * @route   PATCH /api/admin/orders/:id
 * @access  Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Out Of Delivery",
      "Delivered",
      "Confirmed",
      "Cancelled",
    ];
 
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
 
    const order = await Order.findById(req.params.id).populate("user", "username");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
   
    const previousStatus = order.status;
    order.status = status;
    await order.save();
   
    // Get user ID as string
    let userId;
    if (typeof order.user === 'object' && order.user._id) {
      userId = order.user._id.toString();
    } else if (typeof order.user === 'object' && order.user.toString) {
      userId = order.user.toString();
    } else {
      userId = order.user;
    }
   
    // Create notification for user
    try {
      await createNotification({
        userId: userId,
        role: "user",
        type: "ORDER_STATUS_UPDATE",
        title: "Order Status Updated",
        message: `Your order #${order._id.toString().slice(-6)} has been ${status.toLowerCase()}`,
        link: `/orders`,
        metadata: { orderId: order._id.toString(), status, previousStatus },
      });
    } catch (error) {
      // Don't fail order if notification fails
    }
    
    res.json({ status: "success", message: "Order status updated", data: order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
};


/**
 * @desc    Admin - Update Payment Status
 * @route   PATCH /api/orders/admin/update-payment/:id
 * @access  Admin
 */
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const allowedStatuses = [
      "Pending",
      "QR Generated",
      "Initiated",
      "Paid",
      "Failed",
    ];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ 
      success: true, 
      message: `Payment status updated to ${paymentStatus}`,
      order 
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Admin - Assign Delivery Boy
 * @route   PATCH /api/orders/admin/assign/:id
 * @access  Admin
 */
// controllers/orderController.js
exports.assignDeliveryBoy = async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;
  
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });
  
    // ✅ PROTECTION ADDED
    if (order.status === "Delivered" || order.status === "Cancelled") {
      return res.status(400).json({
        message: "Cannot assign delivery boy to delivered or cancelled order"
      });
    }
  
    const deliveryBoy = await User.findOne({
      _id: deliveryBoyId,
      role: "delivery",
    });
  
    if (!deliveryBoy)
      return res.status(400).json({ message: "Invalid delivery boy" });
  
    order.deliveryBoy = deliveryBoyId;
    order.status = "Out Of Delivery";
    order.assignedAt = new Date();
  
    await order.save();
    
    // Get user ID as string
    let userId;
    if (typeof order.user === 'object' && order.user._id) {
      userId = order.user._id.toString();
    } else if (typeof order.user === 'object' && order.user.toString) {
      userId = order.user.toString();
    } else {
      userId = order.user;
    }
     
    // Create notification for delivery boy
    try {
      await createNotification({
        userId: deliveryBoyId,
        role: "delivery",
        type: "DELIVERY_ASSIGNED",
        title: "New Delivery Assigned",
        message: `Order #${order._id.toString().slice(-6)} has been assigned to you for delivery`,
        link: `/delivery?page=dashboard`,
        metadata: { orderId: order._id.toString(), userId: userId },
      });
    } catch (error) {
      // Don't fail if notification fails
    }
   
    // Create notification for user
    try {
      await createNotification({
        userId: userId,
        role: "user",
        type: "ORDER_OUT_FOR_DELIVERY",
        title: "Order Out for Delivery",
        message: `Your order #${order._id.toString().slice(-6)} is out for delivery`,
        link: `/orders`,
        metadata: { orderId: order._id.toString() },
      });
    } catch (error) {
      // Don't fail if notification fails
    }
   
    const populatedOrder = await Order.findById(order._id)
      .populate("deliveryBoy", "username name isBlocked");
   
    res.json({
      status: "success",
      message: "Delivery boy assigned",
      data: populatedOrder,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Assignment failed" });
  }
};
 
 
/**
 * @desc    Delivery - Get My Orders
 * @route   GET /api/orders/delivery/my
 * @access  Delivery
 */
exports.getMyDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoy: req.user._id,
      status: { $in: ["Out Of Delivery", "Delivered"] }
    })
      .populate("user", "username email")
      .populate("items.product")
      .sort({ assignedAt: -1 });
 
    res.json({
      status: "success",
      count: orders.length,
      data: orders
    });
 
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch delivery orders" });
  }
};
 
 
/**
 * @desc    Delivery - Mark Delivered
 * @route   PATCH /api/orders/delivery/delivered/:id
 * @access  Delivery
 */
exports.markDelivered = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryBoy: req.user._id
    });
 
    if (!order)
      return res.status(404).json({ message: "Order not found" });
 
    if (order.status !== "Out Of Delivery") {
      return res.status(400).json({ message: "Order is not out for delivery" });
    }

    if (!order.otp?.verified) {
      return res.status(400).json({ 
        message: "OTP not verified. Customer must verify OTP first." 
      });
    }
 
    order.status = "Delivered";
    order.deliveredAt = new Date();
    order.otp = undefined;
  
    await order.save();
   
    // Get user ID as string
    let userId;
    if (typeof order.user === 'object' && order.user._id) {
      userId = order.user._id.toString();
    } else if (typeof order.user === 'object' && order.user.toString) {
      userId = order.user.toString();
    } else {
      userId = order.user;
    }
  
    // Create notification for user
    try {
      await createNotification({
        userId: userId,
        role: "user",
        type: "ORDER_DELIVERED",
        title: "Order Delivered!",
        message: `Your order #${order._id.toString().slice(-6)} has been delivered successfully`,
        link: `/orders`,
        metadata: { orderId: order._id.toString() },
      });
    } catch (error) {
      // Don't fail if notification fails
    }
  
    // Create notification for admin
    try {
      await createNotification({
        role: "admin",
        type: "ORDER_DELIVERED",
        title: "Order Delivered",
        message: `Order #${order._id.toString().slice(-6)} has been delivered`,
        link: `/admin?page=orders`,
        metadata: { orderId: order._id.toString() },
      });
    } catch (error) {
      // Don't fail if notification fails
    }
   
    res.json({
      status: "success",
      message: "Order marked as delivered",
      data: order
    });
 
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

/**
 * @desc    User - Request OTP for delivery
 * @route   POST /api/orders/:id/request-otp
 * @access  Private
 */
exports.requestDeliveryOtp = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Out Of Delivery") {
      return res.status(400).json({ 
        message: "OTP can only be requested when order is out for delivery" 
      });
    }

    if (order.otp?.verified) {
      return res.status(400).json({ 
        message: "OTP already verified for this delivery" 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    order.otp = {
      code: otp,
      expiresAt: expiresAt,
      verified: false,
      requestedAt: new Date()
    };

    await order.save();

    setImmediate(async () => {
      try {
        await sendDeliveryOtpEmail(
          order.user.email,
          otp,
          order._id.toString().slice(-6),
          order.user.username
        );
      } catch (error) {
        console.error("OTP email error:", error.message);
      }
    });

    res.json({
      success: true,
      message: "OTP sent to your email",
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error("Request OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/**
 * @desc    Delivery Boy - Verify OTP
 * @route   POST /api/orders/:id/verify-otp
 * @access  Delivery
 */
exports.verifyDeliveryOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      deliveryBoy: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Out Of Delivery") {
      return res.status(400).json({ message: "Order is not out for delivery" });
    }

    if (order.otp?.verified) {
      return res.json({
        success: true,
        message: "OTP already verified"
      });
    }

    if (!order.otp || order.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (order.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    order.otp.verified = true;
    await order.save();

    res.json({
      success: true,
      message: "OTP verified successfully. You can now complete the delivery."
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};
 