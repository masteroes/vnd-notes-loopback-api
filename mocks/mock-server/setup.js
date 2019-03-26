const { mockServerClient } = require('mockserver-client');
const geoLocationResponse = require('../../tests/data/geoLocationResponse');
const client = mockServerClient(process.env.MOCK_SERVER || 'localhost', process.env.MOCK_PORT || 1080);

client.mockAnyResponse(
  {
    'httpRequest': {
      'method': 'GET',
      'path': '/maps/api/geocode/json',
      'queryStringParameters': [
        {
          'name': 'address',
          'values': ['test,test,test']
        },
        {
          'name': 'key',
          'values': ['testkey']
        }
      ]
    },
    'httpResponse': {
      'statusCode': 200,
      'body': JSON.stringify(geoLocationResponse),
      'delay': {
        'timeUnit': 'MILLISECONDS',
        'value': 50
      }
    }
  }
).then(
  (result) => {
    console.log('Setup mock Success');
  },
  (error) => {
    console.log('Setup mock Failure', error);
  }
);
