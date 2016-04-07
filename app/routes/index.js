var express = require('express');
var router = express.Router();
var posts = require('../controllers/posts');
var users = require('../controllers/users');
var check_session = require('../middleware/check_session_is_expired');

/* GET home page. */
router.get('/posts/list', posts.api.posts_list);
router.post('/users/register', users.api.register);
router.post('/users/login', users.api.login);
router.get('/users/userinfo/:uid', check_session, users.api.userinfo);














module.exports = router;
