const asyncHandler = require('express-async-handler');

const Chat = require('../models/Chat');
const User = require('../models/User');

exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('UserId param not sent with the request');
    return res.sendStatus(400);
  }

  //// One-one chat and users must contain both userId sent by user and id(token)
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestChat');

  // Show user's name of the last message
  isChat = await User.populate(isChat, {
    path: 'latestChat.sender',
    select: 'name pic email',
  });

  // Chat already exist
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    // if not, create new chat
    let chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId], // current logged in user and user try to create the chat
    };

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password',
      );

      res.status(200).send(fullChat);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }
});

//// Fetch all chats of a particular user (logged in user)
// Then sort chats from new to older based on updatedAt: -1
exports.fetchChats = asyncHandler(async (req, res) => {
  try {
    let result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestChat')
      .sort({ updatedAt: -1 });

    result = await User.populate(result, {
      path: 'latestChat.sender',
      select: 'name pic email',
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

//// Create group chat by adding users, including the logged user
exports.createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).send({ message: 'Please fill out all the fields!' });
  }

  // Convert JSON to obj
  let usersObj = JSON.parse(users);

  // Group should have more than 2 users
  if (usersObj.length < 2) {
    return res
      .status(400)
      .send({ message: 'More than 2 users is required to form a group chat' });
  }

  // Select users to group, then add the current user (logged in user) to group
  usersObj.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: usersObj,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).send(fullGroupChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }, // return the new data
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      res.status(404);
      throw new Error('Chat Not Found');
    } else {
      res.json(updatedChat);
    }
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

// Add more users to the Group After Group is created
exports.addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      res.status(404);
      throw new Error('Chat Not Found');
    } else {
      res.json(added);
    }
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

exports.removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removed) {
      res.status(404);
      throw new Error('Chat Not Found');
    } else {
      res.json(removed);
    }
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});
