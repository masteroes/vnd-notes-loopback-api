const sinon = require('sinon');
const { expect } = require('chai');
const disableRemoteApiMethods = require('./disable-remote-api-methods');

describe('components/disable-remote-api-methods.js', () => {
  it('should disable correct methods from params', () => {
    const disableRemoteMethodByName = sinon.spy();

    const app = {
      models: {
        User: {
          disableRemoteMethodByName
        },
        Todo: {
          disableRemoteMethodByName
        }
      }
    };

    const params = {
      User: [
        'foo'
      ],
      Todo: [
        'bar'
      ]
    };

    disableRemoteApiMethods(app, params);

    expect(disableRemoteMethodByName.getCall(0).args[0]).to.equal('foo');
    expect(disableRemoteMethodByName.getCall(1).args[0]).to.equal('bar');
  });
});
