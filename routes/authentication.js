const express = require('express');
const routes = express.Router();
const signupCtrl = require('../controllers/authentication/signup');
const signinCtrl = require('../controllers/authentication/signin');
const authCtrl = require('../middleware/validate');
const googleAuthCtrl = require('../controllers/authentication/googleSignin');

//signup route 
routes.post('/signup', signupCtrl.signup);
//signin route
routes.post('/signin', signinCtrl.signin);
//validate
routes.get('/validate', authCtrl.validate);


routes.get('/login', googleAuthCtrl.googleSignin);
routes.get('/auth/google/callback', googleAuthCtrl.googlCb);
routes.post('/updateRole', googleAuthCtrl.updateTeacher);

module.exports = routes;