const taskService = require('./taskService');

module.exports = (() => {
  return {
    addTask: async (req, res) => {
      // saving a new task
      const results = await taskService.addTask(req.body);

      // success
      return res.status(results.status).json({
        message: results.message
      });
    },
    findAllTasks: async (req, res) => {
      // retrieving all tasks
      const results = await taskService.findAllTasks(req.body);

      // success
      return res.status(results.status).json({
        message: results.message,
        data: {
          tasks: results.data ? results.data.tasks : []
        }
      });
    },
    findTaskByParamId: async (req, res, next, id) => {
      // retrieving task that bears the id parameter passed
      const results = await taskService.findTask(id);

      // if not task is found, return a 404
      if (results.code === 404) {
        return res.status(results.code).json({ message: results.message });
      }

      // if a task is found, attach it to request object 
      // so that the other methods findTask, updateTask and deleteTask will not perform the find operation again
      req.task = results.data.task;
      return next();
    },
    findTask: async (req, res) => {
      // success
      return res.status(200).json({
        message: 'Task retrieved successfully',
        data: {
          task: req.task ? req.task : {}
        }
      });
    },
    updateTask: async (req, res) => {
      // update task
      const results = await taskService.updateTask(req.body, req.task.id);

      // success
      return res.status(results.status).json({
        message: results.message
      });
    },
    deleteTask: async (req, res) => {
      // delete the task
      const results = await taskService.deleteTask(req.task.id);

      // success
      return res.status(results.status).json({
        message: results.message
      });
    }
  }
})();