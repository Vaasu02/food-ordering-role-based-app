// backend/models/PaymentMethod.js

const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Payment method must have a label (e.g., "Visa", "MasterCard").'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'Digital Wallet'],
    default: 'Credit Card',
  },
  token: {
    // This is the dummy token field as required by the assignment
    type: String,
    required: [true, 'A dummy token is required.'],
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);