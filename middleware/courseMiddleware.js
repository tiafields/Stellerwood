const checkRole = (req, res, next) => {
  if (req.user.role !== 'teacher') { // <-- Error occurs here
    return res.status(403).json({ error: 'You are not authorized to perform this action.' });
  }
  next();
};

module.exports = { checkRole };
