const { Chat } = require('../../models');

const getChatMessages = (req, res) => {
  Chat.findAll({
    where: { user_id: '시바' },
    attributes: ['user_id', 'userChat', 'chattingRoom_id'],
  }).then((messages) => {
    // res.status(200).json({ messages });
    console.log('this is get messages', messages);
    return messages;
  });
};

const postChatMessage = async (req, res) => {
  //   console.log('this is req', req);
  //   console.log('this is res', res);
  let result = await Chat.create(req);
  if (result) {
    // res.send('done');
  }
  return;
};
let modules = { postChatMessage, getChatMessages };

module.exports = modules;
