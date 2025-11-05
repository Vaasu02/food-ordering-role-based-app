// backend/models/Restaurant.js

const mongoose = require('mongoose');

// 1. Define the Schema for a single Menu Item (embedded within Restaurant)
const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item must have a name.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Menu item must have a price.'],
    min: [0.01, 'Price must be greater than zero.'],
  },
}, { _id: true }); // Keep separate IDs for menu items if needed later

// 2. Define the main Restaurant Schema
const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant must have a name.'],
    trim: true,
  },
  country: {
    type: String,
    enum: ['India', 'America'],
    required: [true, 'Restaurant must be assigned a country.'],
  },
  menuItems: {
    type: [MenuItemSchema], // Array of embedded Menu Item documents
    default: [],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);