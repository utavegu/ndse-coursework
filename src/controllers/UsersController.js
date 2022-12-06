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
          .json({ status: 'error', error: `email ${error.keyValue.email} занят` })
      }
      return response
        .status(500)
        .json({ status: 'error', error: error.message })
    }
  }

  login(request, response) {
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
  
}

module.exports = new UsersController();