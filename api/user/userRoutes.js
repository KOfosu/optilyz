const userController = require('./userController');
const router = require('express').Router();

module.exports = (() => {
  router.route('/create')
    .post(userController.addUser);

  router.route('/login')
    .post(userController.login);

  return router;
})();