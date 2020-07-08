const { Chat, Users, ChattingRoom } = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const getChatMessages = async (chattingRoomId) => {
  return await Chat.findAll({
    where: { chattingRoomId: chattingRoomId },
    attributes: ['id', 'userId', 'userChat', 'createdAt'],
    include: [{ model: Users, attributes: ['nickname'] }],
  }).then((chats) => chats.map((chat) => chat.dataValues));
};

const postChatMessage = async (message) => {
  const { friendId, user, text } = message;

  const users = [Number(user._id), Number(friendId)].sort();
  let usersInfo = await Users.findAll({
    where: { id: { [Op.or]: users } },
  }).then((result) => result.map((data) => data.dataValues));

  // check chattingRoom exists between users
  let isChattingRoomExist = await ChattingRoom.findOne({
    where: {
      userId: usersInfo[0].id,
      userId2: usersInfo[1].id,
    },
  }).then((res) => res);

  let chattingRoomId;
  // create chattingRoom if it doesn't exist
  if (isChattingRoomExist === null) {
    await ChattingRoom.create({
      userId: usersInfo[0].id,
      userId2: usersInfo[1].id,
      roomname: `${usersInfo[0].nickname} 대화방`,
      roomname2: `${usersInfo[1].nickname} 대화방`,
    }).then((res) => (chattingRoomId = res.dataValues.id));
  } else {
    chattingRoomId = isChattingRoomExist.dataValues.id;
  }

  // post new message
  return await Chat.create({
    userId: user._id,
    chattingRoomId: chattingRoomId,
    userChat: text,
  })
    .then((_) => {
      // add chattingRoomId in res
      message.chattingRoomId = chattingRoomId;
      return message;
    })
    .catch((err) => err);
};
let modules = { postChatMessage, getChatMessages };

module.exports = modules;
