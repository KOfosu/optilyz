const router = require('express').Router();
const taskController = require('./taskController');

module.exports = (() => {
  router.route('/')
    .post(taskController.addTask)
    .get(taskController.findAllTasks);

  router.param('id', taskController.findTaskByParamId);

  router.route('/:id')
    .get(taskController.findTask)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

  return router;
})();