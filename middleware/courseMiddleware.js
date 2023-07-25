const checkRole = (requiredRole) => {
  console.log('create check for ', requiredRole);
  return (req, res, next) => {
    console.log(`checking user ${req.user} for role ${requiredRole}`);

    // Assuming you have a 'role' property on your user object after authentication
    const userRole = req.user.role;

    if (userRole !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // If the user has the required role, continue to the next middleware or route handler
    next();
  };
};

module.exports = { checkRole };

  