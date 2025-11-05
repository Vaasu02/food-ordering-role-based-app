
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


router.post('/', 
  authenticate, 
  createOrder
);


router.get('/', 
  authenticate, 
  restrictToCountry('country'), 
  getOrders
);


router.post('/:id/checkout', 
  authenticate, 
  authorize(['Admin', 'Manager']), 
  checkoutOrder
);


router.post('/:id/cancel', 
  authenticate, 
  authorize(['Admin', 'Manager']), 
  cancelOrder
);


module.exports = router;