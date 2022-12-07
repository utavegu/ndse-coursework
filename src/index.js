const express = require('express');
const http = require('http');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
// const socketIO = require('socket.io');
const config = require('./config');
const usersRouting = require('./routes/users');
const advertisementsRouting = require('./routes/advertisements');

// const socketConnectionCallback = require('./utils/socket');

config.passport.activatePassport();

const app = express();
// Способ запуска через http нужен для работы socketIO, в других случаях хватило бы просто app
const server = http.Server(app);
// const io = socketIO(server);

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
  .use(session({ secret: 'SECRET' }))
  .use(passport.initialize())
  .use(passport.session())
  .use('/api', usersRouting)
  .use('/api', advertisementsRouting)
// .use(error404);

// io.on('connection', socketConnectionCallback);

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