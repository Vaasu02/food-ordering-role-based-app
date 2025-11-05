
const mongoose = require('mongoose');

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
    ref: 'User', 
    required: true,
  },
  items: {
    type: [OrderItemSchema], 
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
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