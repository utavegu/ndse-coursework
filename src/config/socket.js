const ChatModels = require('../models/Chat');

/*
При отправке сообщения нужно:
  1) Найти чат между author и receiver по полю Chat.users. Если чата нет, то создать его. +
  2) Добавить в поле Chat.messages новое сообщение Message. Поле sentAt должно соответствовать текущей дате. +
*/

module.exports = (socket) => {
  const { Message, Chat } = ChatModels

  const MOCK_AUTHOR = '639372280441b8595fea4cb5'; // Достаем из залогиненного юзера
  const MOCK_RECEIVER = '639372280441b8595fea4cb6'; // Вообще нет идей откуда достаем. Видимо, предполагается, что в интерфейсе есть что-то типа профилей пользователя и в профиле будет кнопка "написать персональное сообщение"

  // const { id } = socket;
  // console.log(`---------- Socket connected: ${id} ----------`);

  socket.on('client-to-server', (msg) => {
    (async () => {
      try {
        const message = {
          author: MOCK_AUTHOR,
          text: msg.text,
        }
        const newMessage = new Message(message);
        const chat = await Chat.findOne({ users: [MOCK_AUTHOR, MOCK_RECEIVER] }).select('-__v');
        if (chat) {
          const arrayOfMessages = chat.messages;
          arrayOfMessages.push(newMessage);
          await Chat.findByIdAndUpdate(
            chat.id,
            { messages: arrayOfMessages },
          )
        } else {
          const arrayOfMessages = [];
          arrayOfMessages.push(newMessage);
          const newChat = new Chat({
            users: [MOCK_AUTHOR, MOCK_RECEIVER],
            createdAt: newMessage.sentAt,
            messages: arrayOfMessages,
          });
          await newChat.save()
        }
        const roomName = [MOCK_AUTHOR, MOCK_RECEIVER].join('');
        socket.join(roomName);
        socket
          .to(roomName)
          .emit('server-to-client', newMessage);
        socket.emit('server-to-client', newMessage);
      } catch (error) {
        console.error(error)
      }
    })()
  });

  // socket.on('disconnect', () => {
  //   console.log(`---------- Socket disconnected: ${id} ----------`);
  // });
}
