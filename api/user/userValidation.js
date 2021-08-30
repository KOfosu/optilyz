
const bcrypt = require('bcrypt');
const validator = require('validator');
const util = require('../../util/util');
const User = require('./userModel');

module.exports = (() => {
  return {
    addUserValidator: async (requestBody) => {
      try {
        // validating empty email address
        if (validator.isEmpty(requestBody.email)) {
          return {
            status: 400,
            message: 'Email address is required'
          };
        }

        // validating validity of the email address
        if (!(validator.isEmail(requestBody.email))) {
          return {
            status: 400,
            message: 'Email address is invalid'
          };
        }

        // validating empty password
        if (validator.isEmpty(requestBody.password)) {
          return {
            status: 400,
            message: 'Password is required'
          };
        }

        // validating empty name
        if (validator.isEmpty(requestBody.name)) {
          return {
            status: 400,
            message: 'Name is required'
          };
        }

        // checking if email has already been used to sign up
        const foundUser = await User.findOne({ email: requestBody.email });
        if (foundUser) {
          return {
            status: 400,
            message: 'Email already exists'
          };
        }

        // success
        return {
          status: 200,
          message: 'Validation passed',
        };;
      } catch (error) {
        util.logger.error(error);
        return {
          status: 500,
          message: 'A server error occured'
        }
      }
    },
    loginValidator: async (requestBody) => {
      try {
        // validating empty email address
        if (validator.isEmpty(requestBody.email)) {
          return {
            status: 400,
            message: 'Email address is required'
          };
        }

        // validating the login email address
        if (!(validator.isEmail(requestBody.email))) {
          return {
            status: 400,
            message: 'Email address is invalid'
          };
        }

        // checking if submitted username and password are valid
        const foundUser = await User.findOne({ email: requestBody.email });
        if (!foundUser) {
          return {
            status: 404,
            message: 'User does not exist'
          };
        }

        // checking password against user's saved password
        const response = await bcrypt.compare(requestBody.password, foundUser.password);
        if (!response) {
          return {
            status: 400,
            message: 'Incorrect username or password'
          };
        }

        // success
        return {
          status: 200,
          message: 'Validation passed'
        }
      } catch (error) {
        util.logger.error(error);
        return {
          status: 500,
          message: 'A server error occured'
        }
      }
    }
  }
})();