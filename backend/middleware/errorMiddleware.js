// backend/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Check if a specific status code was set, otherwise default to 500 (Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
      message: err.message,
      // Only send the stack trace in development mode for debugging
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = {
    errorHandler,
  };