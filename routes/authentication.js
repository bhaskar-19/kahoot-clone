const express = require('express');
const routes = express.Router();
const signupCtrl = require('../controllers/authentication/signup');
const signinCtrl = require('../controllers/authentication/signin')
const authCtrl = require('../middleware/validate');


//signup route 
routes.post('/signup', signupCtrl.signup);
//signin route
routes.post('/signin', signinCtrl.signin);
//validate
routes.get('/validate', authCtrl.validate);

module.exports = routes;