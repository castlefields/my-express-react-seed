var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var config = require('../../src/configs/server-test.local');
var httpStatus = require('http-status-codes');

var server = require('../../dist/server.js');
var app;
describe("Check server ", function() {
  before(function(done) {
    app = server.run(config, function() {
      done()
    });
  });
  it("should allow to create item", function(done){
    request(app)
      .post('/items')
      .send({name : 'dummy name'})
      .end(function(err, res){
        expect(res.status).to.be.equal(httpStatus.OK);
        done();
      });
  });
  it("should disallow to create item when no params", function(done){
    request(app)
      .post('/items')
      .end(function(err, res){
        expect(res.status).to.be.equal(httpStatus.UNPROCESSABLE_ENTITY);
        done();
      });
  });
  after(function(done){
    app.close();
    done();
  });
});