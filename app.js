var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chat');
var app = express();

const { Chat } = require('./models');
const { getChatMessages, postChatMessage } = require('./controllers/chatController/chatController');
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);

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

app.io.on('connection', function (socket) {
  console.log('a user connected');

  // 기존에 있는 채팅 정보를 모두 가져와서 보내는 부분
  Chat.findAll({
    where: { user_id: '하핫' },
    attributes: ['user_id', 'userChat', 'chattingRoom_id'],
  }).then((messages) => {
    messages = messages.map((message) => message.dataValues);
    socket.emit('chatMessage', messages);
    return messages;
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  // 클라이언트에서 메세지를 보내면 db에 저장 후 다시 보내준다.
  socket.on('chatMessage', function (msg) {
    postChatMessage(msg);
    socket.emit('chatMessage', [msg]);
  });
});

module.exports = app;
