const { expect } = require('chai');
const Notes = require('./notes');
const responseMock = {
  'userId': 'userId',
  'notesID': '5c998717b06bd21da8856e23',
  'content': 'string',
  'createdAt': '2019-03-26T01:56:24.314Z',
  'updatedAt': '2019-03-26T01:56:24.314Z'
};
describe('models /notes.js', () => {
  let model;

  beforeEach(() => {
    model = {
      create: () => Promise.resolve(responseMock),
      app: {
        models: {}
      }
    };
    Notes(model);
  });

  it('should bind the correct methods', () => {
    expect(typeof model.createNote).to.equal('function');
  });

  it('createNote should return the correct response', async () => {
    const requestPayload = {
      'notesID': '5c998717b06bd21da8856e23',
      'content': 'string'
    };

    const output = await model.createNote(
      'userId',
      requestPayload);

    expect(output).to.deep.equal(responseMock);
  });
});
