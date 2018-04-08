#Documentation

## Resources: 
 1. https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
 2. mlab.com
 3. https://jwt.io/introduction/



// API ROUTES -------------------
// app.get('/setup', (req, res) => {

//     var sam = new User({
//         name: 'Samarth Asthana3',
//         password: 'pwd321',
//         admin: true
//     });

//     sam.save((err) => {
//         if (err) {
//             throw err;
//         }
//         console.log('User created successfully');
//         res.json({
//             IsSuccess: true
//         });
//     });
// });


// route to return all users (GET http://localhost:8080/api/users)
// apiRoutes.get('/users', function (req, res) {
//     User.find({}, function (err, users) {
//         res.json(users);
//     });
// });

// apiRoutes.post('/authenticate', (req, res) => {
//     if (req.body.name) {
//         User.findOne({
//             name: req.body.name
//         }, (err, user) => {
//             if (err) {
//                 console.log(`Failed authentication, ${err}`);
//                 res.json({ IsSuccess: false, Error: err });
//             } else {
//                 if (user && req.body.password && user.password === req.body.password) {
//                     // Get the token 
//                     const payload = {
//                         name: user.name,
//                         admin: user.admin
//                     };
//                     const token = jwt.sign(payload, app.get('superSecret'), {
//                         expiresIn: 60
//                     });

//                     res.json({ IsSuccess: true, Token: token });
//                 } else {
//                     const msg = 'Failed authentication, Incorrect credentials';
//                     console.log(msg);
//                     res.json({ IsSuccess: false, Error: msg });

//                 }
//             }
//         });

//     }
// });
