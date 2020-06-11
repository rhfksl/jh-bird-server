var express = require('express');
var router = express.Router();
const {
  getAllChattingRoomMessages,
  postChatMessage,
} = require('../controllers/chatController/chatController');

/* GET users listing. */
router.post('/getMessages', getAllChattingRoomMessages);
router.post('/', postChatMessage);

module.exports = router;
