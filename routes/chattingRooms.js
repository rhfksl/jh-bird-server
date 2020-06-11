var express = require('express');
var router = express.Router();
const {
  getChattingRoom,
  postChattingRoom,
} = require('../controllers/chattingRoomController/chattingRoomController');

router.post('/getChattingRoomLists', getChattingRoom);
router.post('/', postChattingRoom);

module.exports = router;
