

const Restaurant = require('../models/Restaurant');
const { StatusCodes } = require('http-status-codes');

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

const getRestaurants = async (req, res) => {
  const filter = req.countryFilter || {}; 
  
  const restaurants = await Restaurant.find(filter);

  res.status(StatusCodes.OK).json({ 
    count: restaurants.length,
    data: restaurants 
  });
};

const createRestaurant = async (req, res) => {
  const { name, country, menuItems } = req.body;
  
  if (!name || !country) {
    res.status(400);
    throw new Error("Restaurant name and country are required.");
  }
  validateMenuItems(menuItems);
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