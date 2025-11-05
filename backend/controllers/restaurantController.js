// backend/controllers/restaurantController.js

const Restaurant = require('../models/Restaurant');
const { StatusCodes } = require('http-status-codes');

// --- Helper Function for Menu Item Validation (Optional but good practice) ---
// In a production app, you would use Joi/Zod here. For now, a basic check.
const validateMenuItems = (items) => {
    if (!Array.isArray(items)) {
        return;
    }
    for (const item of items) {
        if (!item.name || typeof item.price !== 'number' || item.price <= 0) {
            throw new Error("All menu items must have a valid name and price greater than 0.");
        }
    }
};


// ------------------------------------------------------------------
// GET /api/restaurants (View Restaurants)
// Accessible by all roles. Filtered by country if restriction is enabled.
// ------------------------------------------------------------------
const getRestaurants = async (req, res) => {
  // req.countryFilter is set by the restrictToCountry middleware for GET requests
  const filter = req.countryFilter || {}; 

  // If user is Admin/Manager, filter might be {}, meaning they see all countries.
  // If user is Member, filter will be { country: 'India' } or { country: 'America' }.
  
  const restaurants = await Restaurant.find(filter);

  res.status(StatusCodes.OK).json({ 
    count: restaurants.length,
    data: restaurants 
  });
};

// ------------------------------------------------------------------
// POST /api/restaurants (Create Restaurant)
// Requires Admin/Manager AND country must match user's country (enforced by middleware)
// ------------------------------------------------------------------
const createRestaurant = async (req, res) => {
  const { name, country, menuItems } = req.body;

  // 1. Input Validation (Basic check)
  if (!name || !country) {
    res.status(400);
    throw new Error("Restaurant name and country are required.");
  }
  validateMenuItems(menuItems);

  // 2. The country check against the user's country is already done by restrictToCountry middleware.
  // If the middleware passed, req.body.country MUST match req.user.country.

  const restaurant = await Restaurant.create({
    name,
    country,
    menuItems,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'Restaurant created successfully.',
    data: restaurant,
  });
};

module.exports = {
  getRestaurants,
  createRestaurant,
};