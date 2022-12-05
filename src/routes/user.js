const express = require('express');
const router = express.Router();
const passport = require('passport');

const UsersController = require('../controllers/UsersController');

// Регистрация пользователя
router.post(
  '/signup',
  UsersController.createUser
)

// Залогиниться
router.post(
  '/signin',
  // UsersController.createUser
)

// router.post('/login',
//   passport.authenticate('local', { failureRedirect: '/user/login' }),
//   UsersController.signIn
// )
// router.get('/signup', UsersController.renderSignUpPage)
// router.post('/signup', UsersController.signUp)
// router.get('/logout', UsersController.logOut)

// router.get('/profile',
//   UsersController.checkAuthenticated,
//   UsersController.renderProfilePage
// )

module.exports = router;