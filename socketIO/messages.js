const { Chat, Users, ChattingRoom } = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

// helper
const createwMessage = (userId, chattingRoomId, text) => {
  return Chat.create({
    userId: userId,
    chattingRoomId: chattingRoomId,
    userChat: text,
  })
    .then((_) => 'success')
    .catch((err) => err);
};

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

  // create chattingRoom in DB if it doesn't exist
  if (isChattingRoomExist === null) {
    isChattingRoomExist = await ChattingRoom.create({
      userId: usersInfo[0].id,
      userId2: usersInfo[1].id,
      roomname: `${usersInfo[0].nickname} 대화방`,
      roomname2: `${usersInfo[1].nickname} 대화방`,
    }).then((res) => res);
  }

  let chattingRoomId = isChattingRoomExist.dataValues.id;
  let isSuccess = await createwMessage(user._id, chattingRoomId, text);
  if (isSuccess === 'success') {
    // message.roomInfo = isChattingRoomExist.dataValues;
    // message.chattingRoomId = chattingRoomId;
    return { message, roomInfo: isChattingRoomExist.dataValues };
  } else {
    console.log('error', isSuccess);
    return;
  }
};
let modules = { postChatMessage, getChatMessages };

module.exports = modules;
