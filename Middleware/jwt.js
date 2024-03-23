// jwtMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (role) => (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ message: 'A token is required for authentication' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    let secretKey;
    switch (role) {
      case 'admin':
        secretKey = process.env.secretAdmin;
        break;
      case 'driver':
        secretKey = process.env.secretDriver;
        break;
      case 'owner':
        secretKey = process.env.secretOwner;
        break;
      default:
        secretKey = process.env.secretUser;
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    // Check if the user's role matches the required role
    if (decoded.role !== role) {
      return res.status(403).send({ message: 'Forbidden' });
    }
  } catch (err) {
    return res.status(401).send({ message: 'Invalid Token' });
  }
  next();
};

module.exports = {
  verifyTokenAdmin: verifyToken('admin'),
  verifyTokenUser: verifyToken('user'),
  verifyTokenDriver: verifyToken('driver'),
  BusOwner: verifyToken('owner'),
};