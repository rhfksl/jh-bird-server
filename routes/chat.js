var express = require('express');
var router = express.Router();
const {
  getChatMessages,
  postChatMessage,
} = require('../controllers/chatController/chatController');
// console.log(require('../controllers/userController/userController'));
/* GET users listing. */
router.get('/', getChatMessages);
router.post('/', postChatMessage);

module.exports = router;
