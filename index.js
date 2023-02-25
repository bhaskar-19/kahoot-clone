const express = require('express');
require('dotenv').config({path:'.env'});
const bodyParser = require('body-parser');
const authenticationRoutes = require('./routes/authentication');
const app = express();

app.use(bodyParser.json());

app.use('/authentication', authenticationRoutes);


const port = process.env.PORT;
app.listen(port);






