// backend/controllers/authController.js

const User = require('../models/User');
// We don't need to explicitly import bcryptjs here because it's used within the User model's methods
const { StatusCodes } = require('http-status-codes');

// ------------------------------------------------------------------
// 1. REGISTER User (POST /api/auth/register)
// ------------------------------------------------------------------
const register = async (req, res) => {
  const { name, email, password, role, country } = req.body;

  if (!name || !email || !password) {
    // If any required field is missing, throw an error
    throw new Error('Please provide name, email, and password.');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Set status to 400 (Bad Request)
    throw new Error('User already exists with this email.');
  }

  // Important: By default, the first user created can be an Admin for setup
  // For this assignment, we'll let the user specify the role, defaulting to 'Member' in the model.
  const user = await User.create({ name, email, password, role, country });

  // Use the instance method to generate the token
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: { 
      email: user.email, 
      name: user.name, 
      role: user.role, 
      country: user.country 
    },
    token,
  });
};


// ------------------------------------------------------------------
// 2. LOGIN User (POST /api/auth/login)
// ------------------------------------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('Please provide email and password.');
  }

  // 1. Find user by email, and explicitly select the password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401); // 401 Unauthorized
    throw new Error('Invalid Credentials');
  }

  // 2. Compare the provided password with the hashed password in the DB
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    res.status(401); // 401 Unauthorized
    throw new Error('Invalid Credentials');
  }

  // 3. Generate token and return response
  const token = user.createJWT();
  
  // To prevent sending the password field back, we access user without selecting password
  user.password = undefined; 

  res.status(StatusCodes.OK).json({ 
    user: { 
      email: user.email, 
      name: user.name, 
      role: user.role, 
      country: user.country 
    }, 
    token 
  });
};

module.exports = {
  register,
  login,
};