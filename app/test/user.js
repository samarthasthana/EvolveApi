process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../Models/user');
const server = require('../../server');
const chai = require('chai');
const { expect } = require('chai')
const chaiHttp = require('chai-http');
const should = chai.should();


chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });

    describe('/GET user without auth token', () => {
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
});