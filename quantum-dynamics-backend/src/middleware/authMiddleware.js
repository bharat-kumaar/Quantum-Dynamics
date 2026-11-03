// ============================================
// PROTECT MIDDLEWARE - VERIFY JWT TOKEN
// ============================================

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please log in."
      });
    }

    // Verify token
    const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// ============================================
// ADMIN MIDDLEWARE - VERIFY ADMIN ROLE
// ============================================

const admin = (req, res, next) => {
  if (req.user && (req.user.role?.toLowerCase() === 'admin' || req.user.role === 'Project Manager')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized. Admin access required.' });
  }
};

module.exports = { protect, admin };
