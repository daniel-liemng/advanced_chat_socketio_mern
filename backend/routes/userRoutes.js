const router = require('express').Router();

const { protect } = require('../middlewares/authMiddleware');

const {
  registerUser,
  authUser,
  getAllUsers,
} = require('../controllers/userControllers');

router.route('/').post(registerUser).get(protect, getAllUsers);
router.route('/login').post(authUser);

module.exports = router;
