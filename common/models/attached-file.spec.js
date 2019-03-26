const { expect } = require('chai');
const attachedFile = require('./attached-file');

const responseMock = {
  'name': 'Hello',
  'filename': 'hello.txt',
  'type': 'text/plain',
  'size': 25,
  'id': '5c99747c22135d199ab1d3af'
};

describe('models/international-payment-consents.js', () => {
  let model;

  beforeEach(() => {
    model = {
      app: {
        models: {
          Container: {
            upload: (req, res, body, cb) => Promise.resolve(responseMock)
          }
        }
      }
    };
    attachedFile(model);
  });

  it('should bind the correct methods', () => {
    expect(typeof model.upload).to.equal('function');
  });

  it('attachedFile should return the correct response', async () => {
    const requestPayload = {
      'notesID': '5c998717b06bd21da8856e23',
      'content': 'string'
    };

    const output = await model.upload(
      'userId',
      requestPayload);

    expect(output).to.deep.equal(responseMock);
  });
});
