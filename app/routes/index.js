var express = require('express');
var router = express.Router();
var topic = require('../controllers/topic');
var users = require('../controllers/users');
var check_session = require('../middleware/check_session_is_expired');

/* GET home page. */
router.get('/topic/list', topic.api.topic_list);
router.post('/users/register', users.api.register);
router.post('/users/login', users.api.login);
router.get('/users/userinfo',check_session,users.api.userinfo);












module.exports = router;
