// const { app: appLogger } = require('node-logger');
const messages = require('../constants/messages');

module.exports = () => (error, req, res, next) => {
  let statusCode = error.statusCode;
  let errorResponse;

  statusCode = statusCode >= 404 || !statusCode ? 500 : statusCode;

  appLogger.error(messages.API_ERROR, {
    method: req.method,
    url: req.url,
    error
  });

  // TODO add securityLogger(error);

  if (errorResponse) {
    res.status(statusCode).send(errorResponse);
  }

  res.status(statusCode).send();
};
