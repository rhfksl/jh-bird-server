const { FriendList, Users } = require('../../models');

const getPk = (nickname) => {
  return Users.findOne({
    where: {
      nickname: nickname,
    },
    attributes: ['id'],
  }).then((result) => result.dataValues.id);
};

const getFriendLists = async (req, res) => {
  const { nickname } = req.body;

  const myPk = await getPk(nickname);

  await FriendList.findAll({
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
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const postFriendLists = async (req, res) => {
  const { myNickname, friendNickname } = req.body;

  const myPk = await getPk(myNickname);
  const friendPk = await getPk(friendNickname);

  let result = await FriendList.create({ userId: myPk, friendId: friendPk }).then(
    (result) => result.dataValues
  );
  res.status(200).json(result);
};

module.exports = { getFriendLists, postFriendLists };
