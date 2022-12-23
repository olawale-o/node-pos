const router = require('express').Router();
const controller = require('./controller');

router.post('/register', controller.create);
router.post('/login', controller.login);
router.post('/new', controller.createUser);

module.exports = router;
