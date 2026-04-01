const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    return next();
  } else {
    console.log(`🚫 Access denied: User ${req.user?.email || 'Unknown'} is not an Admin (Role: ${req.user?.role || 'None'})`);
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { adminOnly };
