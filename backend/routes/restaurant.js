// backend/routes/restaurant.js

const express = require('express');
const router = express.Router();

const {
  getRestaurants,
  createRestaurant,
} = require('../controllers/restaurantController');

const { authenticate, authorize } = require('../middleware/authMiddleware');
const { restrictToCountry } = require('../middleware/countryMiddleware');

// GET /api/restaurants
// Accessible by all roles. Filtered by country if restriction is active.
router.get('/', 
  authenticate, 
  restrictToCountry('country'), // Applies country filtering logic for GETs
  getRestaurants
);

// POST /api/restaurants
// Requires Admin OR Manager role AND country restriction check on the input data.
router.post('/', 
  authenticate, 
  authorize(['Admin', 'Manager']), 
  restrictToCountry('country'), // Ensures the body contains a valid country matching the user
  createRestaurant
);

module.exports = router;