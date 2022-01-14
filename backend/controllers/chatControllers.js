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

exports.createGroupChat = asyncHandler(async (req, res) => {});

exports.renameGroup = asyncHandler(async (req, res) => {});

exports.removeFromGroup = asyncHandler(async (req, res) => {});

exports.addToGroup = asyncHandler(async (req, res) => {});
