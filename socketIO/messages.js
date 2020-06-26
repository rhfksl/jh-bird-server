const { Chat, Users } = require('../models');

const getChatMessages = async (chattingRoomId) => {
  return await Chat.findAll({
    where: { chattingRoomId: chattingRoomId },
    attributes: ['id', 'userId', 'userChat', 'createdAt'],
    include: [{ model: Users, attributes: ['nickname'] }],
  }).then((chats) => chats.map((chat) => chat.dataValues));
};

const postChatMessage = (message) => {
  // const { chattingRoomId, userId, userChat } = message;
  return (
    Chat.create({
      userId: message.user._id,
      chattingRoomId: message.chattingRoomId,
      userChat: message.text,
    })
      .then((_) => {
        // console.log('fine????', _);
        return message;
      })
      // .then((result) => result.dataValues)
      .catch((err) => err)
  );
};
let modules = { postChatMessage, getChatMessages };

module.exports = modules;
