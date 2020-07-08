var express = require('express');
var router = express.Router();
const {
  getChattingRoom,
  postChattingRoom,
  isChattingRoomExist,
} = require('../controllers/chattingRoomController/chattingRoomController');

router.post('/getChattingRoomLists', getChattingRoom);
router.post('/isChattingRoomExist', isChattingRoomExist);
router.post('/', postChattingRoom);

module.exports = router;
