const ChatController = require('../controllers/ChatController');

module.exports = (socket) => {

  const MOCK_AUTHOR = '639372280441b8595fea4cb5'; // Достаем из залогиненного юзера. Но как это сделать без реквеста? В сокете не видать
  const MOCK_RECEIVER = '639372280441b8595fea4cb6'; // Вообще нет идей откуда достаем. Видимо, предполагается, что в интерфейсе есть что-то типа профилей пользователя и в профиле будет кнопка "написать персональное сообщение" (ДОЛЖНО ПЕРЕДАВАТЬСЯ ПАРАМЕТРОМ, ГДЕ-ТО В ТЗ ПИСАЛОСЬ НА ЭТУ ТЕМУ)

  // const { id } = socket;
  // console.log(`---------- Socket connected: ${id} ----------`);

  socket.on('client-to-server', (msg) => {
    // TODO: Так, момент, а мне тут точно теперь нужны асинки-эвэйты, если они есть в контроллере? Но прием классный, сохрани его в свою книгу рецептов (IIFE с асинком. Дичь про точку с запятой перед можешь туда же добавить)
    (async () => {
      try {
        const message = await ChatController.sendMessage(MOCK_AUTHOR, MOCK_RECEIVER, msg.text);
        const chat = await ChatController.find([MOCK_AUTHOR, MOCK_RECEIVER]);
        ChatController.subscribe(((chatID, message) => {
          // console.log(`В чате ${chatID} появилось новое сообщение: "${message}"`)
          const roomName = chatID;
          socket.join(roomName);
          socket
            .to(roomName)
            .emit('server-to-client', message);
          socket.emit('server-to-client', message);
        })(chat.id, message));
      } catch (error) {
        console.error(error)
      }
    })()
  });

  // socket.on('disconnect', () => {
  //   console.log(`---------- Socket disconnected: ${id} ----------`);
  // });
}
