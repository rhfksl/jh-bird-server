const { Users, Chat } = require('../../models');

const getAllChattingRoomMessages = async (req, res) => {
  const { userId, chattingRoomId } = req.body;
  let messages = await Chat.findAll({
    where: { chattingRoomId: chattingRoomId },
    attributes: ['id', 'userId', 'userChat', 'createdAt'],
    include: [{ model: Users, attributes: ['nickname'] }],
  });

  res.json(messages);
};

const postChatMessage = async (req, res) => {
  const { chattingRoomId, userId, userChat } = req.body;
  let postMsg = await Chat.create({
    userId: userId,
    chattingRoomId: chattingRoomId,
    userChat: userChat,
  })
    .then((_) => res.sendStatus(200))
    .catch((err) => err);
};
let modules = { postChatMessage, getAllChattingRoomMessages };

module.exports = modules;
