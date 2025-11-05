
const express = require('express');
const router = express.Router();

const {
  getRestaurants,
  createRestaurant,
} = require('../controllers/restaurantController');

const { authenticate, authorize } = require('../middleware/authMiddleware');
const { restrictToCountry } = require('../middleware/countryMiddleware');


router.get('/', 
  authenticate, 
  restrictToCountry('country'), 
  getRestaurants
);


router.post('/', 
  authenticate, 
  authorize(['Admin', 'Manager']), 
  restrictToCountry('country'), 
  createRestaurant
);

module.exports = router;