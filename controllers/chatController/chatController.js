const { Chat } = require('../../models');

const getChatMessages = async (req, res) => {
  let result = await Chat.findAll({
    where: { user_id: '고라니' },
    attributes: ['user_id', 'userChat', 'chattingRoom_id'],
  }).then((messages) => {
    return messages;
  });
  result = result.map((msg) => msg.dataValues);
  return result;
};

const postChatMessage = async (req, res) => {
  let result = await Chat.create(req);
  if (result) {
    // res.send('done');
  }
  return;
};
let modules = { postChatMessage, getChatMessages };

module.exports = modules;
