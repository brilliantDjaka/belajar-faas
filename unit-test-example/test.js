'use strict';

const expect = require('chai').expect;

const handler = require('./handler');

describe('Our API', async () => {
  it('Give a 201 for any request', async () => {
    let cb = async function (err, val) {};
    let context = new FunctionContext(cb);
    let event = new FunctionEvent({ body: '', headers:{} });
    await handler(event, context);
    expect(context.status()).to.equal(200)
  });
});

class FunctionEvent {
  constructor(req) {
    this.body = req.body;
    this.headers = req.headers;
    this.method = req.method;
    this.query = req.query;
    this.path = req.path;
  }
}

class FunctionContext {
  constructor(cb) {
    this.value = 200;
    this.cb = cb;
    this.headerValues = {};
    this.cbCalled = 0;
  }

  status(value) {
    if (!value) {
      return this.value;
    }

    this.value = value;
    return this;
  }

  headers(value) {
    if (!value) {
      return this.headerValues;
    }

    this.headerValues = value;
    return this;
  }

  succeed(value) {
    let err;
    this.cbCalled++;
    this.cb(err, value);
  }

  fail(value) {
    let message;
    this.cbCalled++;
    this.cb(value, message);
  }
}
