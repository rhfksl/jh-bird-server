const { Users } = require('../../models');

const postUser = (req, res) => {
  // Find or create the game in the games table
  // Register the score along with the given user_id using JWT token
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

module.exports = postUser;
