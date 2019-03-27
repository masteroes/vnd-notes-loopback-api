const sinon = require('sinon');
const { expect } = require('chai');
const attachedFile = require('./attached-file');
const formidable = require('formidable').IncomingForm();

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
            upload: (req, res, body, cb) => Promise.resolve({
              files: {
                file: ['file1']
              }
            })
          }
        },
        dataSources: {
          storage: {
            settings: {
              name: 'storage',
              root: 'root'
            }
          }
        }
      },
      create: () => Promise.resolve(responseMock)
    };
    attachedFile(model);
  });

  it('should bind the correct methods', () => {
    expect(typeof model.upload).to.equal('function');
  });

  // it('attachedFile should return the correct response', async () => {
  //   sinon.stub(formidable, 'parse').callsFake(() => ({
  //     fields: 'fields'
  //   }));
  //
  //   const output = await model.upload(
  //     {
  //       headers: {
  //         'content-type': 'multipart/formdata'
  //       },
  //       on: () => {}
  //     },
  //     {},
  //     null,
  //     null);
  //
  //   expect(output).to.deep.equal(responseMock);
  // });
});
