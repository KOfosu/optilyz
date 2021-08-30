require('dotenv').config();
const mongoose = require('mongoose');

const userService = require('./userService');
const User = require('./userModel');

describe('User Service', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  describe('Testing addUser', () => {
    it('validates empty email address', async () => {
      const requestBody = {
        email: '',
        password: '',
        name: ''
      };

      const results = await userService.addUser(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Email address is required');
    });

    it('validates invalid email address', async () => {
      const requestBody = {
        email: 'sasas.com',
        password: '',
        name: ''
      };

      const results = await userService.addUser(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Email address is invalid');
    });

    it('validates empty password', async () => {
      const requestBody = {
        email: 'sasas@sas.com',
        password: '',
        name: ''
      };

      const results = await userService.addUser(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Password is required');
    });

    it('validates empty name', async () => {
      const requestBody = {
        email: 'sasas@sas.com',
        password: 'sasasas',
        name: ''
      };

      const results = await userService.addUser(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Name is required');
    });

    it('saves user successfully', async () => {
      const requestBody = {
        email: 'sasas@sas.com',
        password: 'sasasas',
        name: 'sasasas'
      };

      const results = await userService.addUser(requestBody);

      expect(results.status).toEqual(201);
      expect(results.message).toEqual('User saved successfully');
    });

    it('validates duplicate email usage', async () => {
      const requestBody = {
        email: 'sasas@sas.com',
        password: 'sasasas',
        name: 'sasasas'
      };

      const results = await userService.addUser(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Email already exists');
    });
  });

  describe('Testing login', () => {
    it('validates empty email address', async () => {
      const requestBody = {
        email: '',
        password: 'sasasas'
      };

      const results = await userService.login(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Email address is required');
    });

    it('validates invalid login email', async () => {
      const requestBody = {
        email: 'sasas@sasioiocom',
        password: 'sasasas'
      };

      const results = await userService.login(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Email address is invalid');
    });

    it('checks if user does not exist', async () => {
      const requestBody = {
        email: 'sasas@sasioio.com',
        password: 'sasasas'
      };

      const results = await userService.login(requestBody);

      expect(results.status).toEqual(404);
      expect(results.message).toEqual('User does not exist');
    });

    it('validates password', async () => {
      const requestBody = {
        email: 'sasas@sas.com',
        password: 'sasasasewwewewew'
      };

      const results = await userService.login(requestBody);

      expect(results.status).toEqual(400);
      expect(results.message).toEqual('Incorrect username or password');
    });

    it('logs user in successfully and generate token', async () => {
      const requestBody = {
        email: 'sasas@sas.com',
        password: 'sasasas'
      };

      const results = await userService.login(requestBody);

      expect(results.status).toEqual(200);
      expect(results.message).toEqual('Login successful');
      expect(results.data).toBeDefined();
      expect(results.data.token).toBeDefined();
    });
  });
});