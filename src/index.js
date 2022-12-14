const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

const config = require('./config');
const usersRouting = require('./routes/users');
const advertisementsRouting = require('./routes/advertisements');

const app = express();
const server = require('http').createServer(app);

config.passport.activatePassport();
const socketConnectionCallback = config.socket;

const sessionMiddleware = session({ secret: "SECRET" });

// TODO Этих ребят давай потом тоже в конфиг
const {
  DELIVERY_INTERNAL_PORT,
  MONGODB_SERVICE_NAME,
  MONGODB_INTERNAL_PORT,
  MONGODB_LOGIN,
  MONGODB_PASSWORD,
  DB_NAME,
} = process.env;

// TODO: И ее
const mongoDbConnectionUrl = `mongodb://${MONGODB_LOGIN}:${MONGODB_PASSWORD}@${MONGODB_SERVICE_NAME}:${MONGODB_INTERNAL_PORT}/`;

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(sessionMiddleware)
  .use(passport.initialize())
  .use(passport.session())
  .use('/api', usersRouting)
  .use('/api', advertisementsRouting)
// .use(error404); TODO: Неплохо бы добавить, если успеешь

// Ручка для теста сокетов
app.get('/chat', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'socket-test.html'));
});

const io = socketIO(server);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io
  .use(wrap(sessionMiddleware))
  .use(wrap(passport.initialize()))
  .use(wrap(passport.session()))
  .on('connection', socketConnectionCallback);

const start = async () => {
  try {
    await mongoose.connect(mongoDbConnectionUrl, {
      user: MONGODB_LOGIN,
      pass: MONGODB_PASSWORD,
      dbName: DB_NAME,
    });
    server.listen(DELIVERY_INTERNAL_PORT, () => {
      console.log(`
        Сервер библиотеки слушает на ${DELIVERY_INTERNAL_PORT} порту!
        Подключение к базе данных ${DB_NAME} произведено успешно!
      `);
    })
  } catch (error) {
    console.error(String(error))
  }
}

start().catch(error => console.error(error));