var express = require('express');
var router = express.Router();
const { getUserData, signUpUser, login } = require('../controllers/userController/userController');

/* GET users listing. */
router.post('/datas', getUserData);
router.post('/signUp', signUpUser);
router.post('/signIn', login);

module.exports = router;
