require('jest-extended');
const request = require('supertest');

const app = require('../../app');

describe('Task Integration Tests', () => {
  let token;
  let taskId;
  beforeAll(async () => {
    const requestBody = {
      name: 'Kingsley',
      email: 'kk@k.com',
      password: 'qwerty'
    };

    // create a user and use their token process all other requests
    await request(app).post('/api/users/create').send(requestBody);

    // log in and get a token
    const response = await request(app).post('/api/users/login').send(requestBody);
    token = response.body.data.token;
  });

  describe('Token Tests', () => {
    it('rejects requests without a token', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: new Date(),
        reminderTime: new Date(),
        isCompleted: false
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(requestBody);

      expect(response.status).toEqual(401);
    });
  });

  describe('POST /api/tasks/', () => {
    it('validates empty title', async () => {
      const requestBody = {
        title: '',
        description: 'asasasas',
        startTime: new Date(),
        reminderTime: new Date(),
        isCompleted: false
      };

      const response = await request(app)
        .post('/api/tasks/')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Title of task is required');
    });

    it('validates empty description', async () => {
      const requestBody = {
        title: 'sasasa',
        description: '',
        startTime: new Date(),
        reminderTime: new Date(),
        isCompleted: false
      };

      const response = await request(app).post('/api/tasks/')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Task description is required');
    });

    it('validates invalid start time', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: '05-05-2018',
        reminderTime: new Date(),
        isCompleted: false
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Start time for task is invalid');
    });

    it('validates invalid reminder time', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: new Date(),
        reminderTime: '05-05-2018',
        isCompleted: false
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Reminder time for task is invalid');
    });

    it('validates invalid isCompleted type', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: new Date(),
        reminderTime: new Date(),
        isCompleted: 'false'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('"isCompleted" must be a boolean');
    });

    it('saves task successfully', async () => {
      const requestBody = {
        title: 'sasasa',
        description: 'sasasasas',
        startTime: new Date(),
        reminderTime: new Date(),
        isCompleted: false
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual('Task successfully saved');
    });
  });

  describe('GET /api/tasks/', () => {
    it('retrieves all tasks successfully', async () => {
      const requestBody = {};

      const response = await request(app)
        .get('/api/tasks/')
        .set('Authorization', `Bearer ${token}`)
        .query(requestBody);
      taskId = response.body.data.tasks[0]._id;

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Tasks retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.tasks).toBeDefined();
      expect(response.body.data.tasks).toBeArray();
    });
  });

  describe('GET /api/tasks/<taskId>', () => {
    it('retrieves a task successfully', async () => {
      const requestBody = {};

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .query(requestBody);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Task retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.task).toBeDefined();
      expect(response.body.data.task).toBeObject();
    });
  });

  describe('PUT /api/tasks/<taskId>', () => {
    it('updates a task successfully', async () => {
      const requestBody = {
        title: 'wewewewe',
        description: 'eewewewew',
        startTime: new Date(),
        reminderTime: new Date(),
        isCompleted: true
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Task updated successfully');
    });
  });

  describe('DELETE /api/tasks/<taskId>', () => {
    it('deletes a task successfully', async () => {
      const requestBody = {};

      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Task deleted successfully');
    });
  });
});