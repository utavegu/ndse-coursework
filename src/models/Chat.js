const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  readAt: {
    type: Date,
  },
})

const chatSchema = new Schema({
  users: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  messages: {
    type: [messageSchema],
  },
})

module.exports = {
  Message: model('Message', messageSchema),
  Chat: model('Chat', chatSchema)
}
