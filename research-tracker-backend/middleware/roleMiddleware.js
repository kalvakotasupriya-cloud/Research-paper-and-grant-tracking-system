const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Forbidden: insufficient role" });
  }
  return next();
};

export default roleMiddleware;
