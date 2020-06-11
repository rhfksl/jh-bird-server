const { ChattingRoom, Users } = require('../../models');

const getPk = (nickname) => {
  return Users.findOne({
    where: {
      nickname: nickname,
    },
    attributes: ['id'],
  }).then((result) => result.dataValues.id);
};

const getChattingRoom = async (req, res) => {
  const { myNickname } = req.body;

  const myPk = await getPk(myNickname);

  await ChattingRoom.findAll({
    where: { userId: myPk },
  })
    .then((result) => {
      return result.map((val) => val.dataValues);
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const postChattingRoom = async (req, res) => {
  const { myNickname, friendNickname } = req.body;

  const myPk = await getPk(myNickname);

  let result = await ChattingRoom.findOrCreate({
    where: { roomname: `${friendNickname} 과의 대화방` },
    defaults: {
      userId: myPk,
    },
  }).then((result) => result);
  res.status(200).json(result);
};

module.exports = { getChattingRoom, postChattingRoom };
