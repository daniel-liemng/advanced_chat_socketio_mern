const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    // hold userID
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // view the latest message in FE
    // hold messageID
    latestChat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
