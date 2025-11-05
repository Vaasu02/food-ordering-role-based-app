// backend/routes/order.js

const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrders,
  checkoutOrder,
  cancelOrder,
} = require('../controllers/orderController');

const { authenticate, authorize } = require('../middleware/authMiddleware');
const { restrictToCountry } = require('../middleware/countryMiddleware');

// POST /api/orders
// Accessible by ALL roles. Order country is implicitly set by the user's country from JWT.
router.post('/', 
  authenticate, 
  createOrder
);

// GET /api/orders
// Admins/Managers see ALL orders. Members see only their own (filtered by country).
router.get('/', 
  authenticate, 
  restrictToCountry('country'), // Adds country filter for Members, ignored for Admin/Manager in controller
  getOrders
);

// POST /api/orders/:id/checkout
// Restricted to Admin/Manager.
router.post('/:id/checkout', 
  authenticate, 
  authorize(['Admin', 'Manager']), 
  checkoutOrder
);

// POST /api/orders/:id/cancel
// Restricted to Admin/Manager.
router.post('/:id/cancel', 
  authenticate, 
  authorize(['Admin', 'Manager']), 
  cancelOrder
);


module.exports = router;