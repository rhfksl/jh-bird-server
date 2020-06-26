const { Users, FriendList, ChattingRoom, Chat } = require('../../models');
const { getFriendLists } = require('../friendListController/friendList');

const getAllChattingRoomMessages = async (chattingRoomId) => {
  let result = await Chat.findAll({
    where: { chattingRoomId: chattingRoomId },
    attributes: ['id', 'userId', 'userChat', 'createdAt'],
    include: [{ model: Users, attributes: ['nickname'] }],
  });

  // 이게 필요
  // {
  //   _id: 1,
  //   text: 'what?',
  //   createdAt: new Date(),
  //   user: {
  //     _id: 2,
  //     name: 'React Native',
  //     avatar: 'https://placeimg.com/140/140/any',
  //   },
  // },

  // console.log('check', result);

  return result.map((val) => {
    // format message for using react-native-gifted-chat
    const message = {};
    message._id = val.dataValues.id;
    message.text = val.dataValues.userChat;
    message.createdAt = val.dataValues.createdAt;
    message.user = {};
    message.user._id = val.dataValues.userId;
    message.user.name = val.dataValues.User.nickname;
    message.user.avatar = 'https://placeimg.com/140/140/any';

    return message;
  });
};

const getUserData = async (req, res) => {
  const { user_id } = req.body;

  const userDataObj = {};

  // get user infomation
  const userInfo = await Users.findOne({
    where: {
      user_id: user_id,
    },
    attributes: ['id', 'user_id', 'nickname'],
  }).then((result) => result.dataValues);

  userDataObj.user = userInfo;

  const myPk = userInfo.id;

  // get All FriendLists using primaryKey
  const friendLists = await FriendList.findAll({
    where: { userId: myPk },
    attributes: ['userId', 'friendId'],
    include: [
      {
        model: Users,
        attributes: ['id', 'nickname'],
      },
    ],
  })
    .then((result) => result.map((val) => val.User))
    .catch((err) => {
      res.status(400).json(err);
    });

  // insert Lists in result object
  userDataObj.friendLists = friendLists;

  // get all chattingRooms
  const allChatRooms = await ChattingRoom.findAll({
    where: { userId: myPk },
    attributes: [['id', 'chattingRoomId'], 'roomname', 'createdAt'],
  })
    .then((result) => {
      return result.map((val) => val.dataValues);
    })
    .catch((err) => {
      res.status(400).json(err);
    });

  // get all chat messages and add messages to each chatroom
  for (let i = 0; i < allChatRooms.length; i++) {
    const temp = await getAllChattingRoomMessages(allChatRooms[i].chattingRoomId);
    allChatRooms[i].messages = temp;
  }

  // console.log('check', allChatRooms);

  // translate all messages Array to object
  const messagesObj = {};
  allChatRooms.forEach((room) => {
    messagesObj[room.chattingRoomId] = {};
    messagesObj[room.chattingRoomId].createdAt = room.createdAt;
    messagesObj[room.chattingRoomId].roomname = room.roomname;
    // room.messages = room.messages.map(msg=>{

    // })
    messagesObj[room.chattingRoomId].messages = room.messages;
  });

  // insert chattings in result object
  userDataObj.allChatRooms = messagesObj;

  res.status(200).json(userDataObj);
};

const signUpUser = async (req, res) => {
  const { user_id, password, nickname } = req.body;

  let isUsers = await Users.findOne({ where: { user_id } })
    .then((result) => result)
    .catch((e) => res.json(e));

  if (isUsers) {
    res.json({ body: '유저가 이미 존재합니다' });
    return;
  }

  let isNickname = await Users.findOne({ where: { nickname } })
    .then((result) => result)
    .catch((e) => res.json(e));

  if (isNickname) {
    res.json({ body: '닉네임이 이미 존재합니다' });
    return;
  }
  await Users.create({ user_id, nickname, password })
    .then((_) => {
      res.json({ user_id, nickname });
    })
    .catch((err) => err);
};

const login = async (req, res) => {
  const { user_id, password } = req.body;

  Users.findOne({ where: { user_id } })
    .then((result) => {
      if (result === null) {
        res.json({ body: '아이디가 존재하지 않습니다' });
        return;
      }

      if (result.dataValues.password === password) {
        res.json({ user_id, nickname: result.dataValues.nickname });
        return;
      } else {
        res.json({ body: '비밀번호가 맞지 않습니다.' });
      }
    })
    .catch((e) => res.json(e));
};

const modules = { getUserData, signUpUser, login };
module.exports = modules;
