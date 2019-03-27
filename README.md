# vnd-notes-loopback-api API

## Description

The channel API for storing , uploading attachments, and getting geolocation for address using storage and google apis (written in javascript and loopback framework). This API acts as the interface between the Frontend and the Google Api , mongodb and storage services e.g. S3.

All endpoints and specs mentioedin Swagger [Swagger](https://github.com/masteroes/vnd-notes-loopback-api/blob/master/definitions/vnd-notes-loopback-api.yml).

### Routes

Base Path: `/notes/v1/`

Routes:
- _GET_ &nbsp; `/locations/geocode?street=test&city=test&zipcode=test` - Used by FrontEnd , to retrieve geolocations for address. The response is the geoLocation cordinates with HTTP 200. If error, a HTTP 500 response is given.  If a validation /autorization error occurs  in the HTTP headers, an HTTP 400 error is sent back.
- _POST_ &nbsp; `/Notes/createNote` - Used by FrontEnd ,used to store the Note to MongoDb. The response is the same as the request payload with additional timestamps for the creation and updated time. If a validation error occurs in the payload or the HTTP headers, an HTTP 500 error is sent back.
- _POST_ &nbsp; `/AttachedFiles/upload` - Used by FrontEnd ,to upload attachment to storage server , whose id/url is used as attachment for Note. The response is the file save info with new unique id. If fails, a HTTP 500 response is given.

### Logging

The  `loopback-component-logger` is used on this project. This will capture HTTP header information per request for logging purposes. This is useful for tracking requests in higher environments.

### Error handling

Middleware in loopback for error Handling is used for all errors and unhappy path. Stack trace is removed.
Custom middleware - error-handler is used for error handling.

All captured errors are rendered in a consistent JSON format for the FrontEnd to process. See below for an example:

```
{
  "error": {
    "statusCode": 500,
    "message": "Internal Server Error"
  }
}
```

## Run

You can run this in your development environment via a local node Server.

- Run MockServer - ` npm run start:mock:server`
- Run MockServer - ` npm run setup-mock`
- Run Node - `npm start` or `node .`
- Run in DEBUG mode - `DEBUG=* node .`

## Test

All tests are written in javascript. The unit tests used chai, mocha and adjacent to main files in *.spec.js files.
Component tests used supertest and  in tests/component/supertest directory. They can be run via below commands in terminal.

npm start - Node server start
npm run debug - Node server debugger
npm run format - Eslint execution.
npm run test:unit - Only unit test execution
npm run test:coverage - Only unit test execution
npm test - Unit test execution with Coverage
npm run setup-mocks - set mocks for Functional testing execution
npm run test:component - Functional testing execution

All the above tests must pass for a successful build.
