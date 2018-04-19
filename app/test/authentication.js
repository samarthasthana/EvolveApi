process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../Models/user');
const server = require('../../server');
const appConstants = require('../Constant/constants');
const config = require('../Configs/config-test');
const bcrypt = require('bcryptjs');
const chai = require('chai');
const { expect } = require('chai')
const chaiHttp = require('chai-http');
const should = chai.should();



chai.use(chaiHttp);

//Add an Admin users for testing. 
describe('Authentication', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });

        let hashPwd = bcrypt.hashSync(appConstants.TestUser.password, config.salt);
        let adminUser = new User({
            username: appConstants.TestUser.username,
            password: hashPwd,
            admin: appConstants.TestUser.admin
        });

        User.create(adminUser, (err, user) => {
            if (err) {
                console.log('Test user setup failed');
            } else {
                console.log(`Test user setup successful, Id = ${user.id}`);
            }
        });
    });

    describe('/api/login user with incorrect req body', () => {
        it('it should return 400 status for empty request body', (done) => {
            chai.request(server)
                .post('/api/login')
                .set('content-type', 'application/json')
                .send({})        
                .end((err, res) => {
                    res.should.have.status(400);
                    expect(res.body).to.eql({});
                    done();
                });
        });

        it('it should return 400 status for no password in req body', (done) => {
            chai.request(server)
                .post('/api/login')
                .set('content-type', 'application/json')
                .send({
                    username: appConstants.TestUser.username
                })        
                .end((err, res) => {
                    res.should.have.status(400);
                    expect(res.body).to.eql({});
                    done();
                });
        });

        it('it should return 400 status for no username in req body', (done) => {
            chai.request(server)
                .post('/api/login')
                .set('content-type', 'application/json')
                .send({
                    "password": appConstants.TestUser.password
                })        
                .end((err, res) => {
                    res.should.have.status(400);
                    expect(res.body).to.eql({});
                    done();
                });
        });
    });

    describe('/api/login user with correct req body', () => {
        it('it should return 200 status and valid token', (done) => {
            chai.request(server)
                .post('/api/login')
                .set('content-type', 'application/json')
                .send({
                    "username": appConstants.TestUser.username,
                    "password": appConstants.TestUser.password
                })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    expect(res.body.IsSuccess).to.be.true;
                    expect(res.body.Token).to.be.a('string');
                    res.body.Token.should.not.be.empty;
                    done();
                });
        });
    });
});