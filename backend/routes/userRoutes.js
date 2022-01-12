const router = require('express').Router();

const { registerUser, authUser } = require('../controllers/userControllers');

router.route('/').post(registerUser);
router.route('/login').post(authUser);

module.exports = router;
