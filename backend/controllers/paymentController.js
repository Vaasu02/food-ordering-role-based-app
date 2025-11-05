// backend/controllers/paymentController.js

const PaymentMethod = require('../models/PaymentMethod');
const { StatusCodes } = require('http-status-codes');

// ------------------------------------------------------------------
// 1. POST /api/payments (Create Payment Method) - Admin Only
// ------------------------------------------------------------------
const createPaymentMethod = async (req, res) => {
  const { label, type, token } = req.body;

  if (!label || !token) {
    res.status(400);
    throw new Error('Please provide a label and a dummy token for the payment method.');
  }

  const paymentMethod = await PaymentMethod.create({
    label,
    type,
    token,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'Payment method added successfully.',
    data: paymentMethod,
  });
};

// ------------------------------------------------------------------
// 2. GET /api/payments (List Payment Methods) - Admin Only
// ------------------------------------------------------------------
const getPaymentMethods = async (req, res) => {
  // Since the 'authorize' middleware ensures only Admin reaches here, we simply fetch all
  const paymentMethods = await PaymentMethod.find({});

  res.status(StatusCodes.OK).json({
    count: paymentMethods.length,
    data: paymentMethods,
  });
};

module.exports = {
  createPaymentMethod,
  getPaymentMethods,
};