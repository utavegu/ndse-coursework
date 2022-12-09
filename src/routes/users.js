const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/UsersController');
const config = require('../config');

const authenticate = config.passport.authenticateSetup;

// Регистрация пользователя
router.post(
  '/signup',
  UsersController.createUser
)

// Залогиниться
router.post(
  '/signin',
  authenticate('local'),
  UsersController.login
);

// Разлогиниться
router.get(
  '/signout',
  UsersController.logout
)

module.exports = router;