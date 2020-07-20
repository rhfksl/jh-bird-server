const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat');
const chattingRoomsRouter = require('./routes/chattingRooms');
const friendListsRouter = require('./routes/friendLists');
const app = express();

const { getChatMessages, postChatMessage } = require('./socketIO/messages');
const { userJoin, userLeave } = require('./socketIO/users');

app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cors
var whitelist = [
  'http://localhost:19006',
  'http://127.0.0.1:19001',
  'http://localhost:19000',
  'https://localhost',
  'http://172.30.1.47:19006',
  'http://192.168.1.86:19001',
  'http://192.168.1.86:19000',
];
app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) === -1) {
        const message =
          "The CORS policy for this origin doesn't " + 'allow access from the particular origin.';
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: ['http://localhost:19006'],
//     methods: ['GET', 'POST', 'OPTIONS'],
//     credentials: true,
//   })
// );

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/friendLists', friendListsRouter);
app.use('/chattingRooms', chattingRoomsRouter);
app.use('/chats', chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.io.on('connection', async function (socket) {
  socket.on('joinRoom', async ({ user_id, nickname, friendId }) => {
    console.log('room에 조인합니닷', nickname, friendId);
    const user = userJoin(socket.id, nickname, friendId);
    socket.join(friendId);

    // 클라이언트에서 메세지를 보내면 db에 저장 후 다시 보내준다.
    socket.on('message', async function (msg) {
      // const user = getCurrentUser(socket.id);

      let post = await postChatMessage(msg);

      app.io.to(post.roomInfo.userId).emit('message', post);
      app.io.to(post.roomInfo.userId2).emit('message', post);
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      console.log('나갑니닷', user);
    });
  });
});

module.exports = app;

// npx sequelize model:create --name Users --attributes "user_id:string, password:string, nickname:string"
// npx sequelize model:create --name FriendList --attributes "userId:integer, friendId:integer"
// npx sequelize model:create --name ChattingRoom --attributes "roomname:string, userId:integer"
// npx sequelize model:create --name Chat --attributes "userChat:string, chattingRoomId:integer, userId:integer"
