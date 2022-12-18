const ChatModels = require('../models/Chat');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const { Message, Chat } = ChatModels

class ChatController {

  async find(users) {
    const chat = await Chat.findOne({ users }).select('-__v');
    return chat;
  }

  subscribe(callback) {
    eventEmitter.emit('sendMessage', callback)
  }
  // А слушать это событие из другого места нужно так:
  // eventEmitter.on('sendMessage', (arg) => {
  //   console.log(arg);
  // })

  async sendMessage(author, receiver, text) {
    const newMessage = new Message({ author, text });
    const chat = await this.find([author, receiver])
    if (chat) {
      await Chat.findByIdAndUpdate(
        chat.id,
        { $push: { messages: newMessage } },
      )
    } else {
      const newChat = new Chat({
        users: [author, receiver],
        createdAt: newMessage.sentAt,
        messages: new Array(newMessage),
      });
      await newChat.save()
    }
    return newMessage;
  }



}

module.exports = new ChatController();