const { Schema, model, mongoose } = require('mongoose');

// TODO: Что-то тут джээсдок не дружит со схемамим монгуза похоже...

const userSchema = new Schema({
  /**
   * Электронная почта пользователя идентификатор пользователя
   */
  email: {
    type: String,
    required: true,
    unique: true,
  },
  /**
   * Зашифрованный пароль пользователя
   */
  passwordHash: {
    type: String,
    required: true,
  },
  /**
   * Имя пользователя
   */
  name: {
    type: String,
    required: true,
  },
  /**
   * Контактный телефон пользователя
   */
  contactPhone: {
    type: String,
  },
})

module.exports = model('User', userSchema)