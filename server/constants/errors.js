const UNAVAILABLE_ERR = {
  statusCode: 503,
  errName: 'ServiceUnavailableError',
  message: 'Open circuit error'
};

const OPEN_CIRCUIT_CODES = [
  'ECONNREFUSED', 'CommandRejected', 'OpenCircuitError', 'CommandTimeOut', 'ETIMEDOUT'
];

const HYSTRIX_ERROR = 'ServiceUnavailableError';

const SOAP_FAULT_ERROR = 'SOAP fault error';
const UNKNOWN_DOWNSTREAM = 'UNKNOWN';

const ERROR_MATCHED = {
  MESSAGE: 'ERR_MSG',
  CODE: 'ERR_CODE',
  FAULT: 'SOAP_ERROR'
};

module.exports = {
  UNAVAILABLE_ERR,
  OPEN_CIRCUIT_CODES,
  HYSTRIX_ERROR,
  SOAP_FAULT_ERROR,
  UNKNOWN_DOWNSTREAM,
  ERROR_MATCHED
};
