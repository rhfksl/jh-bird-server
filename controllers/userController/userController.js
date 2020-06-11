const { Users, FriendList, ChattingRoom, Chat } = require('../../models');
const { getFriendLists } = require('../friendListController/friendList');

const getAllChattingRoomMessages = async (chattingRoomId) => {
  let result = await Chat.findAll({
    where: { chattingRoomId: chattingRoomId },
    attributes: ['id', 'userId', 'userChat', 'createdAt'],
    include: [{ model: Users, attributes: ['nickname'] }],
  });

  return result.map((val) => {
    val.dataValues.nickname = val.dataValues.User.nickname;
    delete val.dataValues.User;
    return val;
  });
};

const getUserData = async (req, res) => {
  const { user_id } = req.body;

  const userDataObj = {};

  // get primaryKey
  const myPk = await Users.findOne({
    where: {
      user_id: user_id,
    },
    attributes: ['id'],
  }).then((result) => result.dataValues.id);

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

  // insert chattings in result object
  userDataObj.allChatRooms = allChatRooms;

  res.status(200).json(userDataObj);
};

const postUser = (req, res) => {
  const { user_id, password, nickname } = req.body;

  Users.findOrCreate({
    where: { user_id },
    defaults: {
      password,
      nickname,
    },
  })
    // eslint-disable-next-line
    .then(([result, created]) => {
      if (!created) {
        res.sendStatus(409);
      } else {
        res.sendStatus(201);
      }
    })
    .catch(() => {
      res.sendStatus(409);
    });
};

const modules = { getUserData, postUser };
module.exports = modules;
