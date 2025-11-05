
const restrictToCountry = (resourceCountryField) => {
    return (req, res, next) => {
      
      const userCountry = req.user.country;
      const userRole = req.user.role;
      
      const isAdminOrManager = userRole === 'Admin' || userRole === 'Manager';
      
      let resourceCountry = req.body[resourceCountryField];
  
      if (!isAdminOrManager && userCountry && resourceCountry && userCountry !== resourceCountry) {
        res.status(403); 
        throw new Error(`Country Restriction: Cannot operate on resources outside of your assigned country (${userCountry}).`);
      }
  
      if (req.method === 'GET' && userCountry && !isAdminOrManager) {
          req.countryFilter = { country: userCountry };
      }
  
  
      next();
    };
  };
  
  module.exports = {
    restrictToCountry,
  };