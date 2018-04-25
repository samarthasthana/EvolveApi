process.env.NODE_ENV = 'test';

const User = require('../Models/user');
const appConstants = require('../Constant/constants');
const bcrypt = require('bcryptjs');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

module.exports = {
    // setupTestUsers: () => {
    //     User.remove({}, (err) => { });
    //     let hashPwd = bcrypt.hashSync(appConstants.TestAdminUser.password, Number(process.env.SALT));
    //     let adminUser = new User({
    //         username: appConstants.TestAdminUser.username,
    //         password: hashPwd,
    //         admin: appConstants.TestAdminUser.admin
    //     });

    //     User.create(adminUser, (err, user) => {
    //         if (err) {
    //             console.log('Test user setup failed');
    //         } else {
    //             console.log(`Test user setup successful, Id = ${user.id}`);
    //             adminUser = Object.assign({}, {...adminUser}, {...user});
    //         }
    //     });
    //     return adminUser;
    // },
    // cleanTestUsers: () => {
    //     User.remove({}, (err) => { });
    // }
};