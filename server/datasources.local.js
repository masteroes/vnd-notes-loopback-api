module.exports = {
  'notesDB': {
    'host': process.env.MONGO_HOST || 'localhost',
    'port': process.env.MONGO_PORT || '27017',
    'url': process.env.MONGO || '',
    'database': process.env.MONGO_DB || 'myDB',
    'password': process.env.MONGO_PSWD || '',
    'name': process.env.MONGO_COLLECTION || 'notesDB',
    'user': process.env.MONGO_USER || '',
    'connector': 'mongodb'
  },
  'storage': {
    'name': 'storage',
    'connector': 'loopback-component-storage',
    'provider': 'filesystem',
    'root': '/var/tmp/',
    'maxFileSize': '5000000000'
  },
  'geoLocation': {
    'name': 'geoLocation',
    'crud': false,
    'connector': 'rest',
    'debug': false,
    'options': {
      'headers': {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      'strictSSL': true
    },
    'operations': [
      {
        'template': {
          'method': 'GET',
          'url': process.env.GOOGLE_API + '/maps/api/geocode/json',
          'query': {
            'address': '{street},{city},{zipcode}',
            'key': process.env.GOOGLE_API_KEY
          },
          'options': {
            'strictSSL': true,
            'useQuerystring': true
          },
          'responsePath': '$.results[0].geometry.location'
        },
        'functions': {
          'geocode': [
            'street',
            'city',
            'zipcode'
          ]
        }
      }
    ]
  }
};
