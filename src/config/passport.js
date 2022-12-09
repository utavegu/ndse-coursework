const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
const User = require('../models/User');

module.exports = {
  activatePassport: () => {

    const options = {
      usernameField: "email",
      passwordField: "password",
    }

    // TODO: Давай все-таки callback, а не done для понятности
    const verify = async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username }).select('-__v');
        if (!user) {
          return done(null, false)
        } else {
          const validPassword = await bcrypt.compare(password, user.passwordHash);
          if (!(validPassword)) {
            return done(null, false)
          }
          return done(null, user)
        }
      } catch (error) {
        return done(error)
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
  authenticateSetup: (strategy, options = {}) => (req, res, next) => {
    passport.authenticate(strategy, options, (error, user, info) => {

      if (error) {
        return next(error);
      }

      if (!user) {
        return res.json({
          status: "error",
          error: "Неверный логин или пароль"
        })
      } else if (user) {
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