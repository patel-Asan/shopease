const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  subscribeNewsletter,
  validateDiscount,
  getUserDiscounts
} = require('../controllers/newsletterController');

// All routes require authentication
router.use(auth);

// Subscribe to newsletter and get discount
router.post('/subscribe', subscribeNewsletter);

// Validate discount coupon
router.post('/validate-coupon', validateDiscount);

// Get user's discount history
router.get('/my-discounts', getUserDiscounts);

module.exports = router;