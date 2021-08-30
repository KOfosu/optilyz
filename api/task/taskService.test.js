require('dotenv').config();
require('jest-extended');
const mongoose = require('mongoose');

const taskService = require('./taskService');
const Task = require('./taskModel');

describe('TaskService', () => {
  let taskId;
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await Task.deleteMany({});
    await mongoose.disconnect();
  });

  describe('addTask', () => {
    it('validates empty title', async () => {
      const requestBody = {
        title: '',
        description: 'asasasas',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '2021-10-10T19:48:00',
        isCompleted: false
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Title of task is required');
    });

    it('validates empty description', async () => {
      const requestBody = {
        title: 'sasasa',
        description: '',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '2021-10-10T19:48:00',
        isCompleted: false
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Task description is required');
    });

    it('validates invalid start time', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: '05-05-2018',
        reminderTime: new Date(),
        isCompleted: false
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Start time for task is invalid');
    });

    it('validates invalid reminder time', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '05-05-2018',
        isCompleted: false
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Reminder time for task is invalid');
    });

    it('validates invalid "isCompleted" types', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '2021-10-10T19:48:00',
        isCompleted: 'false'
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('"isCompleted" must be a boolean');
    });

    it('saves task successfully', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '2021-10-10T19:48:00',
        isCompleted: false
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(201);
      expect(results.message).toEqual('Task successfully saved');
    });
  });

  describe('findAllTasks', () => {
    it('retieves tasks successfully', async () => {
      const results = await taskService.findAllTasks();
      taskId = results.data.tasks[0].id;

      expect(results.status).toEqual(200);
      expect(results.message).toEqual('Tasks retrieved successfully');
      expect(results.data).toBeDefined();
      expect(results.data.tasks).toBeDefined();
      expect(results.data.tasks).toBeArray();
    });
  });

  describe('findTask', () => {
    it('retieves a task successfully', async () => {
      const results = await taskService.findTask(taskId);

      expect(results.status).toEqual(200);
      expect(results.message).toEqual('Task retrieved successfully');
      expect(results.data).toBeDefined();
      expect(results.data.task).toBeDefined();
      expect(results.data.task).toBeObject();
    });
  });

  describe('updateTask', () => {
    it('validates empty title', async () => {
      const requestBody = {
        title: '',
        description: 'asasasas',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '2021-10-10T19:48:00',
        isCompleted: false
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Title of task is required');
    });

    it('validates empty description', async () => {
      const requestBody = {
        title: 'sasasa',
        description: '',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '2021-10-10T19:48:00',
        isCompleted: false
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Task description is required');
    });

    it('validates invalid start time', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: '05-05-2018',
        reminderTime: new Date(),
        isCompleted: false
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Start time for task is invalid');
    });

    it('validates invalid reminder time', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '05-05-2018',
        isCompleted: false
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Reminder time for task is invalid');
    });

    it('validates invalid "isCompleted" types', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '2021-10-10T19:48:00',
        isCompleted: 'false'
      };

      const results = await taskService.addTask(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('"isCompleted" must be a boolean');
    });

    it('updates task successfully', async () => {
      const requestBody = {
        title: 'eeeeeee',
        description: 'eeeeeeee',
        startTime: '2021-10-10T14:48:00',
        reminderTime: '2021-10-10T19:48:00',
        isCompleted: false
      };

      const results = await taskService.updateTask(requestBody, taskId);

      expect(results.status).toEqual(200);
      expect(results.message).toEqual('Task updated successfully');
    });
  });

  describe('deleteTask', () => {
    it('deletes a task successfully', async () => {
      const results = await taskService.deleteTask(taskId);

      expect(results.status).toEqual(200);
      expect(results.message).toEqual('Task deleted successfully');
    });
  });
})