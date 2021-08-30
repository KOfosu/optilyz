const userService = require('./userService');

module.exports = (() => {
  return {
    addUser: async (req, res) => {
      const results = await userService.addUser(req.body);

      return res.status(results.status).send({
        message: results.message
      });
    },
    login: async (req, res) => {
      const results = await userService.login(req.body);

      return res.status(results.status).send({
        message: results.message,
        data: {
          token: results.data ? results.data.token : ''
        }
      });
    }
  }
})();