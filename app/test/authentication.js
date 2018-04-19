process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../Models/user');
const server = require('../../server');
const chai = require('chai');
const { expect } = require('chai')
const chaiHttp = require('chai-http');
const should = chai.should();


chai.use(chaiHttp);

//Add an Admin users for testing. 
let adminUser = new User({
    username: 'testAdminUser',
    password: 'testAdmin123',
    admin: true
});

describe('Authentication', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
        
        User.create(adminUser, (err, user) => {
            if (err) {
                console.log('Test user setup failed');
            } else {
                adminUser = Object.assign({}, user.id);
            }
        });
    });

    describe('/api/login user with incorrect req body', () => {
        it('it should return 400 status for empty request body', (done) => {
            chai.request(server)
                .post('/api/login')
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
                .send({
                    username: adminUser.username
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
                .send({
                    password: adminUser.password
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
                .send({
                    username: adminUser.username,
                    password: adminUser.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.eql({});
                    done();
                });
        });
    });
});