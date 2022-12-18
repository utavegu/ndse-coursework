const ChatController = require('../controllers/ChatController');

// В этой версии нет socket.request.user, потому нагородил вот такое. Выглядит как костыль, но это единственный способ, до которого я додумался
const getAuthorId = (sessions) => {
  for (const key in sessions) {
    if (JSON.parse(sessions[key]).hasOwnProperty('passport')) {
      return JSON.parse(sessions[key]).passport.user;
    }
  }
  return null
}

const MOCK_RECEIVER = '639372280441b8595fea4cb6'; // Видимо, предполагается, что в интерфейсе есть что-то типа профилей пользователя и в профиле будет кнопка "написать персональное сообщение", по нажатии по которой и будет отправляться айдишник выбранного пользователя. Потому тут просто замокаю.

module.exports = async (socket) => {
  const authorId = await getAuthorId(socket.request.sessionStore.sessions);
  const chat = await ChatController.find([authorId, MOCK_RECEIVER]);

  if (authorId && chat) {
    chat.messages.forEach(message => {
      if (String(message.author) !== authorId) {
        // TODO: Тут нужно делать запрос в базу на добавление в текущее сообщение поля readAt со значением new Date
      }

      /*
      TODO: "При подключении нового клиента должна создаваться подписка на новые сообщения в чате (модуль «Чат»). Полученное сообщение передаётся целиком клиенту."
      Пока не понимаю до конца, но, похоже, манипуляции с субскрайбом должны быть тоже где-то тут.
      */
    });
  }

  socket.on('client-to-server', async (msg) => {
    try {
      if (authorId) {
        const message = await ChatController.sendMessage(authorId, MOCK_RECEIVER, msg.text);
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
  });
}
