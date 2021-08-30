require('dotenv').config();
const { createLogger, format, transports } = require('winston');
const jwt = require('jsonwebtoken');
const { combine, splat, timestamp, printf } = format;

module.exports = (() => {
  return {
    logger: createLogger({
      level: 'debug',
      format: combine(
        format.metadata(),
        splat(),
        timestamp(),
        printf(({ level, message, timestamp, ...metadata }) => `${timestamp} ${level} : ${message} ${metadata ? JSON.stringify(metadata) : ''}`)
      ),
      transports: [
        new transports.Console({ level: 'info' }),
        new transports.File({ level: 'error', filename: 'logs/error-logs.log' }),
        new transports.File({ level: 'info', filename: 'logs/info-logs.log' }),
      ]
    }),
    generateToken: (params) => {
      return new Promise((resolve, reject) => {
        jwt.sign({ email: params.email }, process.env.TOKEN_KEY, (error, token) => {
          if (error) {
            reject(error);
          }

          resolve(token);
        });
      });
    },
    verifyToken: (token) => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_KEY, (error, authData) => {
          if (error) {
            reject(error);
          }

          resolve(authData)
        });
      });
    }
  }
})();