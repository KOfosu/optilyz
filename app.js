// importing the needed packages
require('dotenv').config();
const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');

const util = require('./util/util');
const User = require('./api/user/userModel')

// importing the route modules
const userRoutes = require('./api/user/userRoutes');
const taskRoutes = require('./api/task/taskRoutes');

// creating the web server
const app = express();

// connecting to the database;
const dbUri = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once("open", () => util.logger.info('Connected successfully to database'));

// setting up the middlewares to be used
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(async (req, res, next) => {
  try {
    if (req.url !== '/api/users' && req.url !== '/api/users/login') {
      // retrieving the access token from the request header
      const bearerHeader = req.headers.authorization;
      if (typeof bearerHeader !== 'undefined') {
        try {
          // retrieve token from authorization header. 
          const bearerToken = bearerHeader.split(' ')[1];

          // verify the token
          const authenticatedData = await util.verifyToken(bearerToken);

          // checking if email from token is valid
          if (authenticatedData.email) {
            const foundUser = await User.findOne({ email: authenticatedData.email });

            if (foundUser) {
              return next();
            };

            // invalid token
            return res.status(401).send({ message: 'Invalid access token' });
          } else {
            // invalid token
            return res.status(401).send({ message: 'Invalid access token' });
          }
        } catch (error) {
          util.logger.error(error);
          return res.status(500).send(error);
        }
      } else {
        return res.status(401).send({ message: 'Invalid access token' });
      }
    }

    return next();
  } catch (error) {
    util.logger.error(error);
  }
});

// setting up the routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('*', (req, res) => {
  return res.status(404).send('Sorry, the requested URL was not found on the server.');
});

// setting up the port to listen to trafiic on
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, util.logger.info(`Server running on ${port}`));
}

module.exports = app;