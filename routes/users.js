var express = require('express');
var router = express.Router();
const { getUserData, postUser } = require('../controllers/userController/userController');

/* GET users listing. */
router.post('/datas', getUserData);
router.post('/', postUser);

module.exports = router;
