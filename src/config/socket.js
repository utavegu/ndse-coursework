const ChatController = require('../controllers/ChatController');

// В этой версии нет socket.request.user, потому нагородил вот такое. Выглядит как костыль, но это единственный способ, до которого я додумался
const getAuthorId = (sessions) => {
  let userId = '';
  for (const key in sessions) {
    if (JSON.parse(sessions[key]).hasOwnProperty('passport')) {
      userId = JSON.parse(sessions[key]).passport.user;
    }
  }
  return userId ? userId : null
}

const MOCK_RECEIVER = '639372280441b8595fea4cb6'; // Видимо, предполагается, что в интерфейсе есть что-то типа профилей пользователя и в профиле будет кнопка "написать персональное сообщение". Потому тут просто замокаю.

module.exports = (socket) => {
  socket.on('client-to-server', (msg) => {
    (async () => {
      try {
        const authorId = getAuthorId(socket.request.sessionStore.sessions);
        if (authorId) {
          const message = await ChatController.sendMessage(authorId, MOCK_RECEIVER, msg.text);
          const chat = await ChatController.find([authorId, MOCK_RECEIVER]);
          ChatController.subscribe(((chatID, message) => {
            // console.info(`В чате ${chatID} появилось новое сообщение: "${message}"`)
            const roomName = chatID;
            socket.join(roomName);
            socket
              .to(roomName)
              .emit('server-to-client', message);
            socket.emit('server-to-client', message);
          })(chat.id, message));
        } else {
          console.log('Чтобы отправить сообщение войдите в систему')
        }
      } catch (error) {
        console.error(error)
      }
    })()
  });
}
