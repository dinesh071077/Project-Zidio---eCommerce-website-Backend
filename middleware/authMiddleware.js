


const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Ensure this matches the one in login route

// Middleware to verify JWT token and attach user info to request
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Token format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    // Attach decoded token (user info) to the request
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
