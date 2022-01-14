const router = require('express').Router();

const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require('../controllers/chatControllers');
const { protect } = require('../middlewares/authMiddleware');

// Create or Access a One on One Chat
router.route('/').post(protect, accessChat);

// Fetch all chats for a particular user (logged in user)
router.route('/').get(protect, fetchChats);

// Create group chat by adding users, including the logged user
router.route('/group').post(protect, createGroupChat);

router.route('/rename').put(protect, renameGroup);

// router.route('/groupremove').get(protect, removeFromGroup);
// router.route('/groupadd').get(protect, addToGroup);

module.exports = router;
