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

// Get all users
// /api/user?search=xxx -> query
// Search users based on partial input
exports.getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        // search if query match the name or email of user, case insensitive
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  // Find all user in search keyword, but not the logged in user
  // To get req.user._id -> route is protected
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
});
