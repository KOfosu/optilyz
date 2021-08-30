const bcrypt = require('bcrypt');

const User = require('./userModel');
const validator = require('./userValidation');
const util = require('../../util/util');

module.exports = (() => {
  return {
    addUser: async (requestBody) => {
      try {
        // validating user input
        const validationResults = await validator.addUserValidator(requestBody);
        if (validationResults.status === 400 || validationResults.status === 500) {
          return validationResults;
        }

        // hashing password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(requestBody.password, saltRounds);

        // creating the user account
        await User.create({
          email: requestBody.email,
          password: hashedPassword,
          name: requestBody.name
        });

        // success
        return {
          status: 201,
          message: 'User saved successfully'
        };
      } catch (error) {
        util.logger.error(error);
        return {
          status: 500,
          message: 'A server error occured while adding user'
        }
      }
    },
    login: async (requestBody) => {
      try {
        // validating the login credentials
        const validationResults = await validator.loginValidator(requestBody);
        if (validationResults.status === 400 || validationResults.status === 404 || validationResults.status === 500) {
          return validationResults;
        }

        // generate token to be submitted with every request for this user
        const generatedToken = await util.generateToken(requestBody);

        // success
        return {
          status: 200,
          message: 'Login successful',
          data: {
            token: generatedToken
          }
        };
      } catch (error) {
        util.logger.error(error);
        return {
          status: 500,
          message: 'A server error occurred while loggin user in'
        }
      }
    }
  }
})();