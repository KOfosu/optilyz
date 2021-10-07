const validator = require('validator');

module.exports = (() => {
  return {
    taskValidator: (requestBody) => {
      // validting title
      if (validator.isEmpty(requestBody.title)) {
        return {
          status: 400,
          message: 'Title of task is required'
        };
      }

      // validating description
      if (validator.isEmpty(requestBody.description)) {
        return {
          status: 400,
          message: 'Task description is required'
        };
      }

      // validate start time for task
      if (requestBody.startTime !== '') {
        if (validator.isISO8601(requestBody.startTime) === false) {
          return {
            status: 400,
            message: 'Start time for task is invalid'
          };
        }
      }

      // validate the reminder/notification time for the task
      if (requestBody.reminderTime !== '') {
        if (validator.isISO8601(requestBody.reminderTime) === false) {
          return {
            status: 400,
            message: 'Reminder time for task is invalid'
          };
        }
      }

      // validating the "is completed variable"
      if (requestBody.isCompleted !== '') {
        if (typeof (requestBody.isCompleted) !== 'boolean') {
          return {
            status: 400,
            message: '"isCompleted" must be a boolean'
          };
        }
      }

      // success
      return {
        status: 200,
        message: 'Validation passed'
      };
    }
  }
})();