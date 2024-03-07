// jwtMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../Config/config');

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send({ message: 'A token is required for authentication' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ message: 'Invalid Token' });
  }
  next();
};



// jwtMiddlewareAdmin.js
const verifyTokenAdmin = (req, res, next) => {
  let token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send({ message: 'A token is required for authentication' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, process.env.Admin_secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ message: 'Invalid Token' });
  }
  next();
};


module.exports = {verifyToken,verifyTokenAdmin};