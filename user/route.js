const router = require('express').Router();
const controller = require('./controller');

router.post('/register', controller.create);
router.post('/login', controller.login);
router.post('/new', controller.createUser);
router.post('/friend-requests', controller.myFriendRequest);

module.exports = router;
