process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const { expect } = require('chai')
const chaiHttp = require('chai-http');
const should = chai.should();

const User = require('../Models/user');
const server = require('../../server');
const testUtils = require('../Utils/testUtils');
const appUtils = require('../Utils/appUtils');

chai.use(chaiHttp);

describe('Users', () => {
    describe('Without auth token', () => {
        describe('/GET user', () => {
            it('it should return 403 status', (done) => {
                chai.request(server)
                    .get('/api/users')
                    .end((err, res) => {
                        res.should.have.status(403);
                        expect(res.body).to.eql({});
                        done();
                    });
            });
        });

        describe('/POST user', () => {
            it('it should return 403 status', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .end((err, res) => {
                        res.should.have.status(403);
                        expect(res.body).to.eql({});
                        done();
                    });
            });
        });

        describe('/PUT user', () => {
            it('it should return 403 status', (done) => {
                chai.request(server)
                    .put('/api/users/1')
                    .end((err, res) => {
                        res.should.have.status(403);
                        expect(res.body).to.eql({});
                        done();
                    });
            });
        });

        describe('/DELETE user', () => {
            it('it should return 403 status', (done) => {
                chai.request(server)
                    .del('/api/users/1')
                    .end((err, res) => {
                        res.should.have.status(403);
                        expect(res.body).to.eql({});
                        done();
                    });
            });
        });
    })

    // describe('With auth token', () => {
    //     let authToken = '';
    //     let verifyUserAuth = {};
    //     before((done) => {
    //         testUtils.setupTestUsers();
    //         done();
    //     });

    //     describe('/GET user', () => {
    //         beforeEach((done) => {
    //             verifyUserAuth = sinon.stub(appUtils, verifyUserAuth);
    //             done();
    //         });

    //         afterEach((done) => {
    //             appUtils.verifyUserAuth.restore();
    //             done();
    //         });

    //         it('checking the sinon stubbing ', (done) => {
    //             verifyUserAuth.yields({ IsSuccess: true, Token: '12345'});
    //             chai.request(server)
    //                 .get('/api/users')
    //                 .end((err, res) => {
    //                     res.should.have.status(403);
    //                     expect(res.body).to.eql({});
    //                     done();
    //                 });
    //         });
    //     });
    // });    
});