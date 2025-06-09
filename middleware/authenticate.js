const jwt = require('jsonwebtoken');

// Replace this with your own secret key (same one used to generate JWTs)
const SECRET_KEY = 'your_secret_key'; // 🔐 Use a secure env variable in real apps

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is present
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
