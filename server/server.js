'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
const circuitBreaker = require('./utils/circuit-breaker-setup');
var logger = require('loopback-component-logger')();
require('dotenv').config();

var app = module.exports = loopback();

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');

    circuitBreaker.initialize(app, 'server/circuit-breaker');

    var baseUrl = app.get('url').replace(/\/$/, '');
    logger.info('Web server listening at: %s', baseUrl);
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) { app.start(); }
});
