// backend/middleware/countryMiddleware.js

/**
 * Middleware 3 (Optional): Restricts resource creation/viewing to the user's assigned country.
 * @param {string} resourceCountryField - The field name in req.body or req.params that holds the country.
 */
const restrictToCountry = (resourceCountryField) => {
    return (req, res, next) => {
      // Assumes 'authenticate' has already run and attached req.user.country and req.user.role
      const userCountry = req.user.country;
      const userRole = req.user.role;
      
      // Admin and Manager bypass country restrictions for GET requests (they see all data)
      // Only Members are restricted by country
      const isAdminOrManager = userRole === 'Admin' || userRole === 'Manager';
      
      // For POST/PUT requests, the resource country is usually in req.body
      let resourceCountry = req.body[resourceCountryField];
  
      // Basic check for existence and match (only for Members on POST/PUT)
      if (!isAdminOrManager && userCountry && resourceCountry && userCountry !== resourceCountry) {
        res.status(403); // 403 Forbidden
        throw new Error(`Country Restriction: Cannot operate on resources outside of your assigned country (${userCountry}).`);
      }
  
      // Special case for GET requests: Add filter to request query for controllers to use
      // Only Members get country filter - Admin/Manager see all
      if (req.method === 'GET' && userCountry && !isAdminOrManager) {
          // This is a subtle point: for GET /restaurants, we don't block, we FILTER.
          // We attach the filter to the request object so the controller can apply it.
          // Admin/Manager don't get this filter, so they see all restaurants
          req.countryFilter = { country: userCountry };
      }
  
  
      next();
    };
  };
  
  module.exports = {
    restrictToCountry,
  };