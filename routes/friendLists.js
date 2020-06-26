var express = require('express');
var router = express.Router();
const {
  getFriendLists,
  postFriendLists,
} = require('../controllers/friendListController/friendList');

router.post('/getLists', getFriendLists);
router.post('/addFriend', postFriendLists);

module.exports = router;
