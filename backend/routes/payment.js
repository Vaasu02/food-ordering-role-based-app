const express = require('express');
const router = express.Router();

const {
  createPaymentMethod,
  getPaymentMethods,
} = require('../controllers/paymentController');

const { authenticate, authorize } = require('../middleware/authMiddleware');


router.use(authenticate, authorize(['Admin']));


router.get('/', getPaymentMethods);

router.post('/', createPaymentMethod);

module.exports = router;