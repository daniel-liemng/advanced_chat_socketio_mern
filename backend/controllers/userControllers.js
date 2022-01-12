const asyncHandler = require('express-async-handler');

const User = require('../models/User');
const generateToken = require('../config/generateToken');

// Register
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, pic });

  if (!user) {
    res.status(400);
    throw new Error('Failed to create a new user');
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

// Login
exports.authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid Credentials');
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});
