// const ChatModels = require('../models/Chat');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// const { Message, Chat } = ChatModels

class ChatController {

  subscribe(callback) {
    eventEmitter.emit('sendMessage', callback)
  }
  // А слушать это событие из другого места нужно так:
  // (но как-то странно и нелогично всё...)
  // eventEmitter.on('sendMessage', (arg) => {
  //   console.log(arg);
  // })

}

module.exports = new ChatController();