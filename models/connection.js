const mongoose = require('mongoose');
require('dotenv').config({path:'../.env'});

const uri = process.env.MONGOURI;
mongoose.connect(uri);

mongoose.Promise = global.Promise;

module.exports = { mongoose };