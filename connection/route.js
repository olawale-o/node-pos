module.exports = function(socket) {
  const router = require('express').Router();
  const controller = require('./controller');

  router.post('/friend-requests', controller.friendRequest);
  return router;
};
