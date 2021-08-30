require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');

const User = require('./userModel');
const app = require('../../app');

describe('User Integration Tests', () => {
  afterAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  describe('POST /api/users/create', () => {
    it('validates empty email address', async () => {
      const requestBody = {
        email: '',
        password: '',
        name: ''
      };

      const response = await request(app).post('/api/users/create').send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Email address is required');
    });

    it('validates empty password', async () => {
      const requestBody = {
        email: 'sasas@sas.com',
        password: '',
        name: ''
      };

      const response = await request(app).post('/api/users/create').send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Password is required');
    });

    it('validates empty name', async () => {
      const requestBody = {
        email: 'sasas@sas.com',
        password: 'sasasas',
        name: ''
      };

      const response = await request(app).post('/api/users/create').send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Name is required');
    });

    it('saves a user successfully', async () => {
      const requestBody = {
        name: 'Kingsley',
        email: 'k@k.com',
        password: 'qwerty'
      };

      const response = await request(app).post('/api/users/create').send(requestBody);

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual('User saved successfully');
    });

    it('validates duplicate email usage', async () => {
      const requestBody = {
        name: 'Kingsley',
        email: 'k@k.com',
        password: 'qwerty'
      };

      const response = await request(app).post('/api/users/create').send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Email already exists');
    });
  });

  describe('POST /api/users/login', () => {
    it('validates empty email address', async () => {
      const requestBody = {
        email: '',
        password: 'sasasas'
      };

      const response = await request(app).post('/api/users/login').send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Email address is required');
    });

    it('validates invalid login email', async () => {
      const requestBody = {
        email: 'sasas@sasioiocom',
        password: 'sasasas'
      };

      const response = await request(app).post('/api/users/login').send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Email address is invalid');
    });

    it('checks if user does not exist', async () => {
      const requestBody = {
        email: 'sasas@sasioio.com',
        password: 'sasasas'
      };

      const response = await request(app).post('/api/users/login').send(requestBody);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('User does not exist');
    });

    it('validates password', async () => {
      const requestBody = {
        email: 'k@k.com',
        password: 'sasasasewwewewew'
      };

      const response = await request(app).post('/api/users/login').send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Incorrect username or password');
    });

    it('logs a user in successfully', async () => {
      const requestBody = {
        email: 'k@k.com',
        password: 'qwerty'
      };

      const response = await request(app).post('/api/users/login').send(requestBody);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Login successful');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeDefined();
    });
  })
});