const { FriendList, Users } = require('../../models');

const getPk = (nickname) => {
  return Users.findOne({
    where: {
      nickname: nickname,
    },
    attributes: ['id'],
  }).then((result) => {
    if (result === null) {
      return null;
    } else {
      return result.dataValues.id;
    }
  });
};

const getFriendLists = async (req, res) => {
  const { nickname } = req.body;

  const myPk = await getPk(nickname);

  return await FriendList.findAll({
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
  let { userId, friendId, friendNickname } = req.body;
  if (!friendId) {
    friendId = await getPk(friendNickname);
  }
  if (!friendId) {
    res.json({ body: 'not exist' });
    return;
  }

  FriendList.create({ userId: userId, friendId: friendId })
    .then((_) =>
      Users.findOne({
        where: { id: friendId },
        attributes: ['id', 'nickname', 'img'],
      }).then((result) => res.status(200).json(result))
    )
    .catch((e) => console.log(e));
};

module.exports = { getFriendLists, postFriendLists };
