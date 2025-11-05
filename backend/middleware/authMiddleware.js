
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const authenticate = async (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401); 
    throw new Error('Authentication invalid: Token missing or improperly formatted');
  }

  
  const token = authHeader.split(' ')[1];

  try {
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    
    req.user = {
      userId: payload.userId,
      role: payload.role,
      country: payload.country 
    };

    next();
  } catch (error) {
    
    res.status(401); 
    throw new Error('Authentication invalid: Invalid token');
  }
};


const authorize = (roles = []) => {
  
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); 
      throw new Error(`Forbidden: Role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource.`);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};