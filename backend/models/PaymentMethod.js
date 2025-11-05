
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
    
    type: String,
    required: [true, 'A dummy token is required.'],
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);