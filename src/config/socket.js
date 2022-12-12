const ChatModels = require('../models/Chat');
const ChatController = require('../controllers/ChatController');

/*
При отправке сообщения нужно:
  1) Найти чат между author и receiver по полю Chat.users. Если чата нет, то создать его. +
  2) Добавить в поле Chat.messages новое сообщение Message. Поле sentAt должно соответствовать текущей дате. +
*/

module.exports = (socket) => {
  const { Message, Chat } = ChatModels

  const MOCK_AUTHOR = '639372280441b8595fea4cb5'; // Достаем из залогиненного юзера
  const MOCK_RECEIVER = '639372280441b8595fea4cb5'; // Вообще нет идей откуда достаем. Видимо, предполагается, что в интерфейсе есть что-то типа профилей пользователя и в профиле будет кнопка "написать персональное сообщение" (ДОЛЖНО ПЕРЕДАВАТЬСЯ ПАРАМЕТРОМ, ГДЕ-ТО В ТЗ ПИСАЛОСЬ НА ЭТУ ТЕМУ)

  // const { id } = socket;
  // console.log(`---------- Socket connected: ${id} ----------`);

  // Каждый раз при добавлении сообщения функция обратного вызова должна вызываться со следующими параметрами
  const subscribeCallback = (chatID, message) => {
    console.log(`В чате ${chatID} появилось новое сообщение: "${message}"`)
    const roomName = chatID;
    socket.join(roomName);
    socket
      .to(roomName)
      .emit('server-to-client', message);
    socket.emit('server-to-client', message);
  }

  socket.on('client-to-server', (msg) => {
    (async () => {
      try {
        const message = {
          author: MOCK_AUTHOR,
          text: msg.text,
        }
        const newMessage = new Message(message);
        const chat = await Chat.findOne({ users: [MOCK_AUTHOR, MOCK_RECEIVER] }).select('-__v');
        const arrayOfMessages = !!chat ? chat.messages : [];
        arrayOfMessages.push(newMessage);
        if (chat) {
          console.log('ТЕСТ ИМЕЮЩЕГОСЯ ЧАТА')
          // const arrayOfMessages = chat.messages;
          // arrayOfMessages.push(newMessage);
          ChatController.subscribe(subscribeCallback(chat.id, newMessage));
          await Chat.findByIdAndUpdate(
            chat.id,
            { messages: arrayOfMessages },
          )
        } else {
          console.log('ТЕСТ НОВОГО ЧАТА')
          // const arrayOfMessages = [];
          // arrayOfMessages.push(newMessage);
          const newChat = new Chat({
            users: [MOCK_AUTHOR, MOCK_RECEIVER],
            createdAt: newMessage.sentAt,
            messages: arrayOfMessages,
          });
          ChatController.subscribe(subscribeCallback(newChat.id, newMessage));
          await newChat.save()
        }
      } catch (error) {
        console.error(error)
      }
    })()
  });

  // socket.on('disconnect', () => {
  //   console.log(`---------- Socket disconnected: ${id} ----------`);
  // });
}
