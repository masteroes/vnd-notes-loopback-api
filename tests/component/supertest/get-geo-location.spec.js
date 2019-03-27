const supertest = require('supertest');
const server = require('../../../server/server');
const { expect } = require('chai');
const expectedResponse = [
  {
    lat: 51.5101771,
    lng: -0.0436857
  }
];

const geoLocationEndpoint = '/notes/v1/locations/geocode';

const validHeaders = {
  'content-type': 'application/json'
};

describe('POST /locations/geocode', function () {
  it('should return 201 the correct response if downstream system returns response', async () => {

    supertest(server)
      .get(geoLocationEndpoint)
      .query({ street: 'test', city: 'test', zipcode: 'test' })
      .set(validHeaders)
      .expect(200)
      .end((error, response) => {
        expect(error).to.be.an('null');
        expect(response.body).to.deep.equal(expectedResponse);
      });
  });
});
