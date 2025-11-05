// backend/routes/payment.js

const express = require('express');
const router = express.Router();

const {
  createPaymentMethod,
  getPaymentMethods,
} = require('../controllers/paymentController');

const { authenticate, authorize } = require('../middleware/authMiddleware');

// Middleware stack for all payment routes: Authenticate user, then check if they are Admin
router.use(authenticate, authorize(['Admin']));

// GET /api/payments - Admin only
router.get('/', getPaymentMethods);

// POST /api/payments - Admin only
router.post('/', createPaymentMethod);

module.exports = router;