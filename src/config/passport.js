const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = {
  activatePassport: () => {

    const options = {
      usernameField: "email",
      passwordField: "passwordHash",
    }

    const verify = async (username, password, callback) => {
      try {
        const user = await User.findOne({ email: username }).select('-__v');
        if (!user) {
          return callback(null, false)
        } else {
          if (!(user.passwordHash === password)) {
            return callback(null, false)
          }
          return callback(null, user)
        }
      } catch (error) {
        return callback(error)
      }
    }

    passport.use('local', new LocalStrategy(options, verify))

    passport.serializeUser((user, cb) => {
      cb(null, user.id)
    })

    passport.deserializeUser(async (id, cb) => {
      try {
        const user = await User.findById(id).select('-__v')
        cb(null, user)
      } catch (error) {
        return cb(error)
      }
    })

  },
  authenticateSetup: (strategy, options) => (req, res, next) => {
    passport.authenticate(strategy, options, (error, user, info) => {

      if (error) {
        return next(error);
      }

      if (!user) {
        return res.json({
          status: "error",
          error: "Неверный логин или пароль"
        })
      }

      if (options.session) {
        return req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return next();
        });
      }

      req.user = user;
      next();

    })(req, res, next);
  }
};