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
const appConstants = require('../Constant/constants');
const jwt = require('jsonwebtoken');

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

    describe('With auth token', () => {
        let authToken = '';
        let newServer;
        let adminUser;

        describe('/GET user', () => {
            beforeEach((done) => {
                adminUser = testUtils.setupTestUsers();
                sinon.stub(appUtils, 'verifyUserAuth').returns(() => { });
                sinon.stub(jwt, 'verify');                
                newServer = require('../../server');                
                done();
            });

            afterEach((done) => {
                appUtils.verifyUserAuth.restore();
                jwt.verify.restore();
                done();
            });

            it('checking the sinon stubbing ', (done) => {
                jwt.verify.yields(null, {user: adminUser});
                chai.request(newServer)
                    .get('/api/users')
                    .set('authorization', `${appConstants.Bearer} 123`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        expect(res.body).to.be.an('array').that.is.not.empty;
                        expect(res.body[0].username).to.eql(adminUser.username);
                        done();
                    });
            });
        });
    });    
});