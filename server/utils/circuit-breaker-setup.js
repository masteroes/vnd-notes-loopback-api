'use strict';

const Promise = require('bluebird');
const hystrix = require('hystrixjs');
const path = require('path');
const fs = require('fs');

const {
  UNAVAILABLE_ERR,
  OPEN_CIRCUIT_CODES,
  HYSTRIX_ERROR,
  SOAP_FAULT_ERROR,
  UNKNOWN_DOWNSTREAM,
  ERROR_MATCHED
} = require('../constants/errors');

const DEFAULTS = require('../constants/default.json');

const hystrixConfig = hystrix.hystrixConfig;
const metricsFactory = hystrix.metricsFactory;
const commandFactory = hystrix.commandFactory;
const circuitFactory = hystrix.circuitFactory;

let _logger, _enableCircuitBreaker;

/**
 * Check if error object contains circuit error
 * @param err
 * @returns {*}
 */
const isCircuitBreakerError = function (err) {
  const errMessage = OPEN_CIRCUIT_CODES.includes(err.message) ?
    ERROR_MATCHED.MESSAGE : getCircuitErrCause(err);
  let circuitErr;

  switch (errMessage) {
    case ERROR_MATCHED.MESSAGE:
      circuitErr = err.message;
      break;
    case ERROR_MATCHED.CODE:
      circuitErr = err.code;
      break;
    case ERROR_MATCHED.FAULT:
      circuitErr = SOAP_FAULT_ERROR;
      break;
    default:
      circuitErr = undefined;
  }

  return circuitErr;
};

function getCircuitErrCause(err) {
  return OPEN_CIRCUIT_CODES.includes(err.code) ? ERROR_MATCHED.CODE : ((err.Fault && err.Fault.faultcode >= 500) ? ERROR_MATCHED.FAULT : null);
}

/**
 * Error handler to customize error object
 * @param error
 * @returns {*}
 */
const isErrorHandler = error => {
  if (error.statusCode > 500 || isCircuitBreakerError(error.cause || error)) {
    error.name = HYSTRIX_ERROR;
    delete error['error@context'];
    return error;
  }
  return null;
};

/**
 *
 * @param modelName
 * @param operationName
 * @param parameters
 * @param serviceName
 */
const execute = (modelName, operationName, parameters, serviceName) => new Promise((resolve, reject) => {
  const params = Array.isArray(parameters) ? parameters : [parameters];

  Promise.promisify(modelName[operationName])(...params)
    .then(response => {
      const cb = circuitFactory.getOrCreate({ commandKey: serviceName });

      // in case of timeout, execution still comes to then function, even though circuit is open
      if (!cb.isOpen()) {
        _logger && _logger.info(`circuit breaker state is CLOSE for: ${serviceName} remote api`, {});
      }
      resolve(response);
    })
    .catch(error => {
      reject(error);
    });
});

/**
 * fallback logic for circuit breaker
 * Executes when api returns error
 * @param serviceName
 * @param err
 * @returns {*}
 */
const fallback = function (serviceName, downstream, err, logger) {
  if (logger.info) {
    _logger = logger;
  }

  const cb = circuitFactory.getOrCreate({ commandKey: serviceName });
  let error = err;
  const circuitError = err.statusCode > 500 ? `status code ${err.statusCode}` : isCircuitBreakerError(err);

  if (cb.isOpen() && circuitError) {
    _logger && _logger.error(`circuit breaker state is OPEN for service: ${serviceName} , reason: ${circuitError} , downstream: ${downstream}`, {});
    error = UNAVAILABLE_ERR;
  } else {
    _logger && _logger.info(`circuit breaker state is CLOSE for: ${serviceName} remote api`, {});
  }

  return Promise.reject(error);
};

const returnInt = (data) => {
  if (typeof data === 'string') {
    return parseInt(data);
  }
  return data;
};

const returnBoolean = (data) => {
  if (data === undefined || data === null) {
    return false;
  }
  return [true, 'true', 'TRUE'].indexOf(data) > -1;
};

/**
 *
 * @param config
 * @returns {*}
 */
const service = (config) => {
  hystrixConfig.init({
    'hystrix.circuit.volumeThreshold.forceOverride': false,
    'hystrix.circuit.volumeThreshold.override': config.minimumRequestForHealthCheck || DEFAULTS.minimumRequestForHealthCheck,
    'hystrix.promise.implementation': Promise
  });

  const serviceCommand = commandFactory.getOrCreate(config.serviceName)
    .timeout(returnInt(config.timeout))
    .circuitBreakerForceClosed(returnBoolean(config.disable))
    .circuitBreakerSleepWindowInMilliseconds(returnInt(config.openTimeoutInMilliseconds) || DEFAULTS.openTimeoutInMilliseconds)
    .circuitBreakerErrorThresholdPercentage(returnInt(config.errorThresholdPercentage) || DEFAULTS.errorThresholdPercentage)
    .circuitBreakerRequestVolumeThreshold(returnInt(config.minimumRequestForHealthCheck) || DEFAULTS.minimumRequestForHealthCheck)
    .statisticalWindowLength(returnInt(config.executionTrackWindow) || DEFAULTS.executionTrackWindow)
    .statisticalWindowNumberOfBuckets(returnInt(config.windowBucket) || DEFAULTS.windowBucket)
    .run(execute)
    .errorHandler(isErrorHandler)
    .fallbackTo(fallback.bind(null, config.serviceName, config.downstream || UNKNOWN_DOWNSTREAM))
    .build();

  return serviceCommand;
};

/**
 * Initialize and attach circuit breaker configs to respective models
 * @param app
 * @param configPath
 * @param loggerInstance
 * @param enableCircuit
 */
const initialize = function (app, configPath, loggerInstance, enableCircuit) {
  _logger = loggerInstance;
  _enableCircuitBreaker = returnBoolean(enableCircuit);
  const models = Object.keys(app.models).map(k => app.models[k]);

  models.forEach(model => {
    const fileName = `${model.definition.name}.js`;
    const filePath = path.resolve(configPath, fileName);

    if (fs.existsSync(filePath)) {
      let configs = require(filePath);
      if (configs.constructor !== Array) {
        configs = [configs];
      }
      configs.forEach(config => {
        config.circuitBreakerForceClosed = _enableCircuitBreaker;
        model.circuitBreaker = service(config);
      });
    }
  });
};

/**
 * Forcefully open circuit for given configuration
 * @param config
 * @param callback
 */
const forceOpen = function (config, callback) {
  try {
    config.circuitBreakerForceOpened = true;
    circuitFactory.getOrCreate(config);
    const metrics = metricsFactory.getOrCreate({ commandKey: config.serviceName });
    metrics.markSuccess();
    metrics.markFailure();
    callback(null, true);
  } catch (e) {
    callback(e, null);
  }
};

/**
 *
 * @param serviceName
 */
const stats = (serviceName) => {
  const metrics = metricsFactory.getOrCreate({
    commandKey: serviceName,
  });

  return JSON.stringify(metrics);
};

module.exports = {
  stats,
  forceOpen,
  initialize,
  service,
  isCircuitBreakerError,
};
