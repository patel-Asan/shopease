const NewsletterDiscount = require('../models/NewsletterDiscount');
const User = require('../models/User');
const crypto = require('crypto');

// Generate unique coupon code
const generateCouponCode = (userId) => {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  const userPart = userId.toString().slice(-6);
  return `DISC10-${userPart}-${timestamp}-${random}`.toUpperCase();
};

// Check if user can claim new discount
const canClaimDiscount = async (userId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentDiscount = await NewsletterDiscount.findOne({
    userId,
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  return !recentDiscount;
};

// Get last claim date for user
const getLastClaimDate = async (userId) => {
  const lastDiscount = await NewsletterDiscount.findOne({ userId })
    .sort({ createdAt: -1 });
  
  return lastDiscount ? lastDiscount.createdAt : null;
};

// Subscribe to newsletter and generate discount
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Validate email matches registered email
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter your registered email address'
      });
    }

    // Check 30 days limit
    const canClaim = await canClaimDiscount(userId);
    if (!canClaim) {
      const lastClaimDate = await getLastClaimDate(userId);
      const nextAvailableDate = new Date(lastClaimDate);
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 30);
      
      return res.status(400).json({
        status: 'error',
        message: 'You have already claimed a discount. Please try again after 30 days.',
        nextAvailableDate: nextAvailableDate
      });
    }

    // Generate coupon code with 10% discount
    const couponCode = generateCouponCode(userId);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const discount = new NewsletterDiscount({
      userId,
      email: email.toLowerCase(),
      couponCode,
      discountPercentage: 10, // Fixed 10%
      expiryDate
    });

    await discount.save();

    res.status(200).json({
      status: 'success',
      message: '10% discount coupon generated successfully!',
      data: {
        couponCode: discount.couponCode,
        discountPercentage: 10,
        expiryDate: discount.expiryDate
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate discount coupon'
    });
  }
};

// Validate and apply discount (for checkout page)
exports.validateDiscount = async (req, res) => {
  try {
    const { couponCode, totalAmount } = req.body;
    const userId = req.user._id;

    const discount = await NewsletterDiscount.findOne({ couponCode });
    
    if (!discount) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid coupon code'
      });
    }

    if (discount.userId.toString() !== userId.toString()) {
      return res.status(400).json({
        status: 'error',
        message: 'This coupon code is not valid for your account'
      });
    }

    if (discount.isUsed) {
      return res.status(400).json({
        status: 'error',
        message: 'This coupon code has already been used'
      });
    }

    if (new Date() > discount.expiryDate) {
      return res.status(400).json({
        status: 'error',
        message: 'This coupon code has expired'
      });
    }

    // Calculate 10% discount
    const discountAmount = totalAmount * 0.10; // 10% of total
    const finalAmount = totalAmount - discountAmount;

    console.log(`=== 10% Discount Applied ===`);
    console.log(`Original Total: ₹${totalAmount}`);
    console.log(`10% Discount: -₹${discountAmount}`);
    console.log(`Final Total: ₹${finalAmount}`);

    res.status(200).json({
      status: 'success',
      data: {
        isValid: true,
        discountPercentage: 10,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        couponCode: discount.couponCode
      }
    });

  } catch (error) {
    console.error('Discount validation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to validate discount'
    });
  }
};

// Apply discount to order (when placing order)
const applyDiscountToOrder = async (couponCode, userId) => {
  try {
    const discount = await NewsletterDiscount.findOne({ couponCode });
    
    if (!discount) {
      throw new Error('Invalid coupon code');
    }
    
    if (discount.userId.toString() !== userId.toString()) {
      throw new Error('Coupon not valid for this user');
    }
    
    if (discount.isUsed) {
      throw new Error('Coupon already used');
    }
    
    if (new Date() > discount.expiryDate) {
      throw new Error('Coupon expired');
    }
    
    // Mark coupon as used
    discount.isUsed = true;
    discount.usedAt = new Date();
    await discount.save();
    
    return {
      discountPercentage: 10, // Fixed 10%
      couponCode: discount.couponCode
    };
    
  } catch (error) {
    throw error;
  }
};

// Get user's discount history
exports.getUserDiscounts = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const discounts = await NewsletterDiscount.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.status(200).json({
      status: 'success',
      data: discounts
    });
    
  } catch (error) {
    console.error('Get user discounts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch discount history'
    });
  }
};

exports.applyDiscountToOrder = applyDiscountToOrder;