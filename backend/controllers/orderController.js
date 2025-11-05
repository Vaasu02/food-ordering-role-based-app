const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');


const createOrder = async (req, res) => {
  const { items } = req.body;
  
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item.');
  }

  for (const item of items) {
    if (!item.name || typeof item.name !== 'string') {
      res.status(400);
      throw new Error('Each order item must have a valid name.');
    }
    if (typeof item.price !== 'number' || item.price <= 0) {
      res.status(400);
      throw new Error('Each order item must have a valid price greater than 0.');
    }
    if (typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
      res.status(400);
      throw new Error('Each order item must have a valid quantity (integer >= 1).');
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const order = await Order.create({
    userId: req.user.userId,
    country: req.user.country, 
    items,
    totalAmount,
    status: 'Pending',
  });

  res.status(StatusCodes.CREATED).json({
    message: 'Order created successfully.',
    data: order,
  });
};

const getOrders = async (req, res) => {
  const { role, userId } = req.user;
  
  let filter = {};

  if (role === 'Member') {
    filter = { userId };
    if (req.countryFilter) {
      filter = { ...filter, ...req.countryFilter };
    }
  } else {
    filter = {}; 
  }

  const orders = await Order.find(filter).populate('userId', 'name email role'); 

  res.status(StatusCodes.OK).json({ 
    count: orders.length,
    data: orders 
  });
};


const checkoutOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  if (order.status !== 'Pending' && order.status !== 'Confirmed') {
    res.status(400);
    throw new Error(`Order cannot be checked out in status: ${order.status}`);
  }

  order.status = 'Completed';
  await order.save();

  res.status(StatusCodes.OK).json({
    message: 'Payment Successful. Order status updated to Completed.',
    data: order,
  });
};

const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  if (order.status === 'Completed') {
    res.status(400);
    throw new Error('Cannot cancel an order that has already been completed.');
  }

  order.status = 'Cancelled';
  await order.save();

  res.status(StatusCodes.OK).json({
    message: 'Order successfully cancelled.',
    data: order,
  });
};


module.exports = {
  createOrder,
  getOrders,
  checkoutOrder,
  cancelOrder,
};