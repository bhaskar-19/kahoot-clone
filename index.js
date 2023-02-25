const express = require('express');
require('dotenv').config({path:'.env'});
const bodyParser = require('body-parser');

const authenticationRoutes = require('./routes/authentication');
const quizRoutes = require('./routes/quiz');

const app = express();

app.use(bodyParser.json());

app.use('/authentication', authenticationRoutes);
app.use('/quiz', quizRoutes);

const port = process.env.PORT;
app.listen(port);






