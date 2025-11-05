// backend/models/Order.js

const mongoose = require('mongoose');

// Schema for the items in the order (similar to menu items, but can be customized per order)
const OrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this order to the User who placed it
    required: true,
  },
  items: {
    type: [OrderItemSchema], // Array of ordered items
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], // Possible order states
    default: 'Pending',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    enum: ['India', 'America'],
    required: [true, 'Order must belong to a country.'],
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);