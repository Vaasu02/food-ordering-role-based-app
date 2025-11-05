// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // We need the User model to fetch user details

/**
 * Middleware 1: Verifies JWT and attaches user details to the request
 */
const authenticate = async (req, res, next) => {
  // 1. Check for token in the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401); // 401 Unauthorized
    throw new Error('Authentication invalid: Token missing or improperly formatted');
  }

  // 2. Extract the token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using the secret
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach user data (including role and country) to the request object
    // We only attach the payload data; no need to hit the database for every request
    req.user = {
      userId: payload.userId,
      role: payload.role,
      country: payload.country // For optional restriction middleware
    };

    next();
  } catch (error) {
    // Token is invalid (expired, wrong signature, etc.)
    res.status(401); // 401 Unauthorized
    throw new Error('Authentication invalid: Invalid token');
  }
};

/**
 * Middleware 2: Restricts access to specific roles
 * @param {string[]} roles - An array of roles allowed to access the route (e.g., ['Admin', 'Manager'])
 */
const authorize = (roles = []) => {
  // Ensure roles is always an array for safety
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // req.user is guaranteed to exist here because 'authenticate' runs first
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // 403 Forbidden
      throw new Error(`Forbidden: Role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource.`);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};