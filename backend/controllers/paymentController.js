const PaymentMethod = require('../models/PaymentMethod');
const { StatusCodes } = require('http-status-codes');

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

const getPaymentMethods = async (req, res) => {
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