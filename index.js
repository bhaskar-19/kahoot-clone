const express = require('express');
require('dotenv').config({path:'.env'});
const bodyParser = require('body-parser');

const authenticationRoutes = require('./routes/authentication');
const quizRoutes = require('./routes/quiz');
const questionRoutes = require('./routes/question');

const app = express();

app.use(bodyParser.json());

app.use('/authentication', authenticationRoutes);
app.use('/quiz', quizRoutes);
app.use('/quiz/question', questionRoutes);

const port = process.env.PORT;
app.listen(port);






