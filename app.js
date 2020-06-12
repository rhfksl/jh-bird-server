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

// const { Chat } = require('./models');
const { getChatMessages, postChatMessage } = require('./socketIO/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./socketIO/users');
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
var whitelist = ['http://localhost:19006'];
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
  // console.log('연결되었습니다');
  // console.log(
  //   socket.on('firstConnection', (req) => {
  //     // console.log('첫 입장', req);
  //     socket.emit('firstConnection', '옛다 먹어라');
  //   })
  // );

  socket.on('joinRoom', async ({ user_id, chattingRoom_id }) => {
    console.log('room에 조인합니닷', user_id, chattingRoom_id);
    const user = userJoin(socket.id, user_id, chattingRoom_id);

    socket.join(user.chattingRoom_id);

    // 기존에 있는 채팅 정보를 모두 가져와서 보내는 부분
    let firstMsg = await getChatMessages();

    // Welcome current user
    // socket.emit('message', 'Welcome to ChatCord!');

    // Broadcast when a user connects
    app.io.to(user.chattingRoom_id).emit('message', firstMsg);

    // Send users and room info
    app.io.to(user.chattingRoom_id).emit('roomUsers', {
      chattingRoom_id: user.chattingRoom_id,
      user_id: getRoomUsers(user.chattingRoom_id),
    });

    // 클라이언트에서 메세지를 보내면 db에 저장 후 다시 보내준다.
    socket.on('message', function (msg) {
      const user = getCurrentUser(socket.id);
      app.io.to(user.chattingRoom_id).emit('message', [msg]);
      postChatMessage(msg);
    });
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    console.log('나갑니닷', user);

    if (user) {
      app.io.to(user.chattingRoom_id).emit(
        'message',
        // formatMessage(botName, `${user.user_id} has left the chat`)
        'left the chat'
      );

      // Send users and room info
      // app.io.to(user.chattingRoom_id).emit('roomUsers', {
      //   chattingRoom_id: user.chattingRoom_id,
      //   users: getRoomUsers(user.chattingRoom_id),
      // });
    }
  });
});

module.exports = app;

// npx sequelize model:create --name Users --attributes "user_id:string, password:string, nickname:string"
// npx sequelize model:create --name FriendList --attributes "userId:integer, friendId:integer"
// npx sequelize model:create --name ChattingRoom --attributes "roomname:string, userId:integer"
// npx sequelize model:create --name Chat --attributes "userChat:string, chattingRoomId:integer, userId:integer"
