import fs from 'fs';
import express from 'express';
import path from 'path';
import passport from 'passport';
import socketIO from 'socket.io';
import cors from 'cors';
import routes from './api/routes/index';
import authorizationMiddleware from './api/middlewares/authorizationMiddleware';
import errorHandlerMiddleware from './api/middlewares/errorHandlerMiddleware';
import routesWhiteList from './config/routesWhiteListConfig';
// import socketInjector from './socket/injector';
import socketHandlers from './socket/handlers';
import sequelize from './data/db/connection';
import { sockets, notificJoin } from './api/services/notificationService';
import env from './config/dbConfig';
import './config/passportConfig';

const app = express();
const io = socketIO();

// const pg = require('pg');

// pg.defaults.ssl = true;
// pg.defaults.ssl = { rejectUnauthorized: false };

// const params = {
//   host: 'ec2-23-21-229-200.compute-1.amazonaws.com',
//   user: 'jagjtitjqcuivh',
//   password: '4c883b09c16429cf48afa54ab3f827ad6fbee219d7b18b9e7ace992267a332cf',
//   database: 'd54qb4ths2r9a4',
//   // sslmode: 'require'
//   // ssl: false
//   ssl: { rejectUnauthorized: false }
// };

// const client = new pg.Client(params);
// client.connect()
//   .then(() => {
//     // eslint-disable-next-line no-console
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     // eslint-disable-next-line no-console
//     console.error('Unable to connect to the database:', err);
//   });

sequelize
  .authenticate()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', err);
  });

io.on('connection', socketHandlers);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// app.use(socketInjector(io));

app.use('/api/', authorizationMiddleware(routesWhiteList));

routes(app, io);

app.get('*', (req, res) => {
  res.writeHead(302, { location: env.app.adress });
  res.end();
});

app.use(errorHandlerMiddleware);

const socketId = socket => {
  for (let i = 0; i < sockets.length; i++) {
    if (sockets[i].id === socket.id) {
      return i;
    }
  }
  return -1;
};
io.on('connection', socket => {
  sockets.push(socket);
  socket.on('createRoom', ({ id, username }) => {
    const sockId = socketId(socket);
    if (sockId >= 0) {
      sockets[sockId].userId = id;
      sockets[sockId].username = username;
      notificJoin(id, username, 'join');
    }
  });
  socket.on('disconnect', () => {
    const sockId = socketId(socket);
    if (sockId >= 0) {
      notificJoin(socket.id, socket.username, 'leave');
      sockets.splice(sockId, 1);
    }
  });
  socket.emit('newRoom');
});

const PORT = env.port || env.app.port;
io.listen(app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}!`);
}));
