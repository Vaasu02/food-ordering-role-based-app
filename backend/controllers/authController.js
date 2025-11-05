
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
  const { name, email, password, role, country } = req.body;

  if (!name || !email || !password) {
    
    throw new Error('Please provide name, email, and password.');
  }

  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); 
    throw new Error('User already exists with this email.');
  }

  
  const user = await User.create({ name, email, password, role, country });

  
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



const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('Please provide email and password.');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401); 
    throw new Error('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    res.status(401); 
    throw new Error('Invalid Credentials');
  }

  const token = user.createJWT();
  
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