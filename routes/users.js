var express = require('express');
var router = express.Router();
const postUser = require('../controllers/userController/userController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/', postUser);

module.exports = router;
