const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('USER', decoded);

      // obtain all user info but no password
      req.user = await User.findById(decoded.id).select('-password');

      console.log('USER', req.user);

      next();
    } catch (err) {
      console.log(err.message);
      res.status(401);
      throw new Error('Not authorized - Token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized - No token');
  }
});
