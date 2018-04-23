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

    describe('With valid auth token', () => {
        let newServer;
        let adminUser;
        beforeEach((done) => {
            adminUser = testUtils.setupTestUsers();
            sinon.stub(appUtils, 'verifyUserAuth').returns(() => { });
            sinon.stub(jwt, 'verify');                
            newServer = require('../../server');                
            done();
        });

        afterEach((done) => {
            testUtils.cleanTestUsers();
            appUtils.verifyUserAuth.restore();
            jwt.verify.restore();
            done();
        });

        describe('/GET user', () => {
            it('fetches users correctly', (done) => {
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

        describe('/POST user', () => {
            describe('with no req body', () => {
                it('throws a 400 validation error', (done) => {
                    jwt.verify.yields(null, { user: adminUser });
                    chai.request(newServer)
                        .post('/api/users')
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .end((err, res) => {
                            expect(err.response.text).contains('ValidationError');
                            res.should.have.status(400);
                            done();
                        });
                });
            });

            describe('with invalid body schema', () => {
                it('throws a 400 validation error for username', (done) => {
                    jwt.verify.yields(null, { user: adminUser });
                    let newUser = Object.assign({}, appConstants.TestNonAdminUser, { username: 'sal' });
                    chai.request(newServer)
                        .post('/api/users')
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .send({...newUser})
                        .end((err, res) => {
                            expect(err.response.text).contains('ValidationError');
                            expect(err.response.text).contains('username');
                            res.should.have.status(400);
                            done();
                        });
                });
            });

            describe('with invalid password schema', () => {
                it('throws a 400 validation error for password', (done) => {
                    jwt.verify.yields(null, { user: adminUser });
                    let newUser = Object.assign({}, appConstants.TestNonAdminUser, { password: 'pwd' });
                    chai.request(newServer)
                        .post('/api/users')
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .send({...newUser})
                        .end((err, res) => {
                            expect(err.response.text).contains('ValidationError');
                            expect(err.response.text).contains('password');
                            res.should.have.status(400);
                            done();
                        });
                });
            });

            describe('with invalid admin value', () => {
                it('throws a 400 validation error for admin', (done) => {
                    jwt.verify.yields(null, { user: adminUser });
                    let newUser = Object.assign({}, appConstants.TestNonAdminUser, { admin: 'val' });
                    chai.request(newServer)
                        .post('/api/users')
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .send({...newUser})
                        .end((err, res) => {
                            expect(err.response.text).contains('ValidationError');
                            expect(err.response.text).contains('admin');
                            res.should.have.status(400);
                            done();
                        });
                });
            });

            describe('with valid request', () => {
                it('creates a user successfully', (done) => {
                    jwt.verify.yields(null, { user: adminUser });
                    let newUser = Object.assign({}, appConstants.TestNonAdminUser);
                    chai.request(newServer)
                        .post('/api/users')
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .send({...newUser})
                        .end((err, res) => {
                            res.should.have.status(200);
                            expect(res.body.username).to.eql(appConstants.TestNonAdminUser.username);
                            done();
                        });
                });
            });
        });

        describe('/Update user', () => {
            const updatedUser = {
                admin: false, 
                username: appConstants.TestAdminUser.username, 
                password: appConstants.TestAdminUser.password
            }
            describe('with invalid body', () => {
                it('throws a 400 validation error', (done) => {
                    jwt.verify.yields(null, { user: adminUser });
                    chai.request(newServer)
                        .put('/api/users/asdf23')
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .send({ admin: false })
                        .end((err, res) => {
                            expect(err.response.text).contains('ValidationError');
                            res.should.have.status(400);
                            done();
                        });
                });
            });

            describe('with invalid id', () => {
                it('throws a 400 user not found', (done) => {
                    jwt.verify.yields(null, { user: adminUser });                    
                    chai.request(newServer)
                        .put('/api/users/asdf23')
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .send(updatedUser)
                        .end((err, res) => {                            
                            res.should.have.status(400);
                            expect(err.response.text).contains('User not found');
                            done();
                        });
                });
            });

            describe('with valid id', () => {
                it('updates the user correctly', (done) => {
                    jwt.verify.yields(null, { user: adminUser });
                    chai.request(newServer)
                        .put(`/api/users/${adminUser.id}`)
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .send(updatedUser)
                        .end((err, res) => {
                            res.should.have.status(200);
                            expect(res.body.admin).to.eql(false);
                            done();
                        });
                });
            });
        });

        describe('/Delete user', () => {
            describe('with invalid id', () => {
                it('throws a 400 ', (done) => {
                    jwt.verify.yields(null, { user: adminUser });                    
                    chai.request(newServer)
                        .delete('/api/users/asdf23')
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .end((err, res) => {
                            res.should.have.status(400);
                            expect(err.response.text).contains('User not deleted');
                            done();
                        });
                });
            });

            describe('with valid id', () => {
                it('deletes the user correctly', (done) => {
                    jwt.verify.yields(null, { user: adminUser });
                    chai.request(newServer)
                        .delete(`/api/users/${adminUser.id}`)
                        .set('authorization', `${appConstants.Bearer} 123`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
            });
        });

    });    
});