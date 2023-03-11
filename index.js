const express = require('express');
require('dotenv').config({path:'.env'});
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');

const authenticationRoutes = require('./routes/authentication');
const quizRoutes = require('./routes/quiz');
const questionRoutes = require('./routes/question');
const gameRoutes = require('./routes/game');
const socketImp = require('./socket/server');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(cors());

const publicPath = path.join(__dirname, './public');
app.use(express.static(publicPath));

app.use('/authentication', authenticationRoutes);
app.use('/quiz', quizRoutes);
app.use('/quiz/question', questionRoutes);
app.use('/game',gameRoutes);

socketImp.socketImplementation(io);

const port = process.env.PORT;
server.listen(port, ()=> console.log("Server started on port 3000"));






