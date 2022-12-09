const User = require('../models/User');
const bcrypt = require("bcrypt");

class UsersController {

  async createUser(request, response) {
    try {
      if (!request.body.password) {
        return response
          .status(418)
          .json({ status: 'error', error: `Введите пароль!` })
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(request.body.password, salt);
      const newUser = new User({ ...request.body, passwordHash: passwordHash });
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
          .json({ status: 'error', error: `email ${error.keyValue.email} занят` })
      }
      return response
        .status(500)
        .json({ status: 'error', error: error.message })
    }
  }

  login(request, response) {
    // TODO: А код ответа какой? status. 200?
    response.json({
      status: "ok",
      data: {
        id: request.user._id,
        email: request.user.email,
        name: request.user.name,
        contactPhone: request.user.contactPhone
      }
    })
  }

  logout(request, response, next) {
    request.logout((error) => {
      if (error) {
        return next(error);
      }
    })
    // Так лучше не делать, конечно
    response.send("Разлогинились успешно!")
  }

}

module.exports = new UsersController();