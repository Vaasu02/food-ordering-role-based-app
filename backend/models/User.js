// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <--- Ensure this is required

// ------------------------------------------------------------------
// 1. DEFINE THE SCHEMA
// ------------------------------------------------------------------
const UserSchema = new mongoose.Schema({ // <--- UserSchema is defined here
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, 
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Member'],
    default: 'Member',
  },
  country: {
    type: String,
    enum: ['India', 'America'],
    required: [true, 'Please select a country (India or America)'],
    default: 'India',
  },
}, {
  timestamps: true
});

// ------------------------------------------------------------------
// 2. DEFINE METHODS/HOOKS ON THE SCHEMA OBJECT
// ------------------------------------------------------------------

// Mongoose Middleware (Pre-save hook for password hashing)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance Method for Password Comparison (Used in Login)
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// Instance Method for JWT Generation (This is what line 6 was referring to)
UserSchema.methods.createJWT = function () { // <--- This must come AFTER the schema definition
  return jwt.sign(
    { 
      userId: this._id, 
      role: this.role,
      country: this.country
    },
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};


// ------------------------------------------------------------------
// 3. EXPORT THE MODEL
// ------------------------------------------------------------------
module.exports = mongoose.model('User', UserSchema);