process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const server = require('../../server');
const appConstants = require('../Constant/constants');
const testUtils = require('../Utils/testUtils');
const sinon = require('sinon');
const bcrypt = require('bcryptjs')
const chai = require('chai');
const { expect } = require('chai')
const chaiHttp = require('chai-http');
const User = require('../Models/user');
const should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
    before((done) => { 
        sinon.stub(User, "findOne");
        done();
    });

    after((done) => {
        User.findOne.restore();
        done();
    })

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
                    username: appConstants.TestAdminUser.username
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
                    "password": appConstants.TestAdminUser.password
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
            //Stub out the Db call
            const fetchedUser = {...appConstants.TestAdminUser};
            fetchedUser.password = bcrypt.hashSync(appConstants.TestAdminUser.password, Number(process.env.SALT));
            User.findOne.yields(null, fetchedUser);

            chai.request(server)
                .post('/api/login')
                .set('content-type', 'application/json')
                .send({
                    "username": appConstants.TestAdminUser.username,
                    "password": appConstants.TestAdminUser.password
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