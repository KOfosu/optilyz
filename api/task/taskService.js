const Task = require('./taskModel');
const validator = require('./taskValidation');
const util = require('../../util/util');

module.exports = (() => {
  return {
    addTask: async (requestBody) => {
      try {
        // validating the task details submitted
        const validationResults = validator.taskValidator(requestBody);
        if (validationResults.status === 400) {
          return validationResults;
        }

        // saving task
        await Task.create({
          title: requestBody.title,
          description: requestBody.description,
          startTime: requestBody.startTime,
          reminderTime: requestBody.reminderTime,
          isCompleted: requestBody.isCompleted
        });

        // success
        return {
          status: 201,
          message: 'Task successfully saved'
        };
      } catch (error) {
        util.logger.error(error);
        return {
          status: 500,
          message: 'A server error occurred while adding a task'
        }
      }
    },
    findAllTasks: async () => {
      try {
        // retrieving all saved tasks
        const foundTasks = await Task.find({});

        // success
        return {
          status: 200,
          message: 'Tasks retrieved successfully',
          data: {
            tasks: foundTasks
          }
        };
      } catch (error) {
        util.logger.error(error);
        return {
          status: 500,
          message: 'A server error occurred while retrieving all tasks'
        }
      }
    },
    findTask: async (taskId) => {
      try {
        // retrieving the task that bears the Id passed 
        const foundTask = await Task.findById(taskId);

        // check if any task was found
        if (!foundTask) {
          return {
            status: 404,
            message: 'No task found'
          }
        }

        // success
        return {
          status: 200,
          message: 'Task retrieved successfully',
          data: {
            task: foundTask
          }
        };
      } catch (error) {
        util.logger.error(error);
        return {
          status: 500,
          message: 'A server error occurred while retrieving task'
        }
      }
    },
    updateTask: async (requestBody, taskId) => {
      try {
        // validating the task details submitted
        const validationResults = validator.taskValidator(requestBody);
        if (validationResults.status === 400) {
          return validationResults;
        }

        // updating the task with the new details
        await Task.updateOne({ _id: taskId }, {
          title: requestBody.title,
          description: requestBody.description,
          startTime: requestBody.startTime,
          reminderTime: requestBody.reminderTime,
          isCompleted: requestBody.isCompleted
        });

        // success
        return {
          status: 200,
          message: 'Task updated successfully'
        };
      } catch (error) {
        util.logger.error(error);
        return {
          status: 500,
          message: 'A server error occurred while retrieving task'
        }
      }
    },
    deleteTask: async (taskId) => {
      try {
        // deleting task
        await Task.deleteOne({ _id: taskId });

        // success
        return {
          status: 200,
          message: 'Task deleted successfully'
        };
      } catch (error) {
        util.logger.error(error);
        return {
          status: 500,
          message: 'A server error occurred while retrieving task'
        }
      }
    }
  }
})();