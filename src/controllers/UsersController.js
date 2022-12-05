const User = require('../models/User');

class UsersController {

  async createUser(request, response) {
    // Вообще, я так понял, прилетает-то мне просто password, а passwordHash уже улетает в монгу. После преобразования.
    const newUser = new User(request.body)
    try {
      await newUser.save()
      response
        .status(201)
        .json({
          status: 'ok',
          data: {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            contactPhone: newUser.contactPhone
          } 
        })
    } catch (error) {
      // TODO: МЭДЖИК ЧИСЛО
      if (error.code === 11000) {
        return response
        .status(500)
        // TODO: После сдачи курсовой: мне не нравится тут поле еррор. Лучше бы message было
        .json({ status: 'error', error: `email ${error.keyValue.email} занят`}) 
      }
      return response
        .status(500)
        .json({ status: 'error', error: error.message})
    }
  }

  /*
  async signUp(req, res) {
    // TODO: неплохо бы еще проверять, что такого req.body.username уже нет в базе
    if (req.body.username && req.body.password && req.body.repeatPassword && req.body.password === req.body.repeatPassword) {
      const newUser = new User(req.body)
      // TODO: права библиотекаря - текущая дата +3 месяца
      try {
        await newUser.save()
        // TODO: По нормальному - редирект на страницу успешной регистрации и через 3 секунды с нее редирект на логина
        console.log("Регистрация прошла успешна, теперь вы можете залогиниться!");
        res
          .status(201)
          .redirect('/user/login');
      } catch (error) {
        res
          .status(500)
          .json(error)
      }
    } else {
      // В идеале тост
      console.log("Ошибка регистрации!");
      res.redirect('/user/signup');
    }
  }

  logOut(req, res, next) {
    req.logout(function (err) {
      if (err) { return next(err); }
    })
    res.redirect('/user')
  }

  checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/user/login')
    }
    next()
  }

  renderProfilePage(req, res) {
    res.render('user/profile', { user: req.user })
  }
  */

}

module.exports = new UsersController();