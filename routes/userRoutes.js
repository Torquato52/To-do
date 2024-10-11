const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', UserController.registerUser);
router.post('/login', UserController.loginUser);

module.exports = router;