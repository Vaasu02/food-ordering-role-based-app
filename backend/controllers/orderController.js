// backend/controllers/orderController.js

const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');

// ------------------------------------------------------------------
// 1. POST /api/orders (Create Order) - All Roles
// ------------------------------------------------------------------
const createOrder = async (req, res) => {
  const { items } = req.body;
  
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item.');
  }

  // Validate order items structure
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

  // Calculate total amount from item prices and quantities
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Set userId and country implicitly from the authenticated user's JWT payload
  const order = await Order.create({
    userId: req.user.userId,
    country: req.user.country, // Automatically uses user's country for the order
    items,
    totalAmount,
    status: 'Pending',
  });

  res.status(StatusCodes.CREATED).json({
    message: 'Order created successfully.',
    data: order,
  });
};

// ------------------------------------------------------------------
// 2. GET /api/orders (List Orders) - Logic is role-dependent
// ------------------------------------------------------------------
const getOrders = async (req, res) => {
  const { role, userId } = req.user;
  
  let filter = {};

  // 1. Role-based filtering
  if (role === 'Member') {
    // Members only see their own orders
    filter = { userId };
    // Apply country filter for Members (optional restriction)
    if (req.countryFilter) {
      filter = { ...filter, ...req.countryFilter };
    }
  } else {
    // Admin and Manager can see ALL orders (no country filter applied)
    // Assignment requirement: "Admin/Manager see all"
    filter = {}; // Empty filter means all orders
  }

  // 2. Fetch orders
  // .populate('userId', 'name email') is a good practice to include user details
  const orders = await Order.find(filter).populate('userId', 'name email role'); 

  res.status(StatusCodes.OK).json({ 
    count: orders.length,
    data: orders 
  });
};

// ------------------------------------------------------------------
// 3. POST /api/orders/:id/checkout (Checkout/Pay) - Admin/Manager Only
// ------------------------------------------------------------------
const checkoutOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  // Dummy payment success flow:
  if (order.status !== 'Pending' && order.status !== 'Confirmed') {
    res.status(400);
    throw new Error(`Order cannot be checked out in status: ${order.status}`);
  }

  // Perform the state change
  order.status = 'Completed';
  await order.save();

  res.status(StatusCodes.OK).json({
    message: 'Payment Successful. Order status updated to Completed.',
    data: order,
  });
};

// ------------------------------------------------------------------
// 4. POST /api/orders/:id/cancel (Cancel Order) - Admin/Manager Only
// ------------------------------------------------------------------
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

  // Perform the state change
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