const express = require('express');
const routes = express.Router();
const auth = require('../middleware/authentication').requireAuth;

const gamesCtrl = require('../controllers/game/games');

routes.get('/:creator',auth, gamesCtrl.games);
routes.get('/games/:quizId',auth, gamesCtrl.gameQuizData);
routes.get('/players/:quizId/:gameId', auth, gamesCtrl.gamePlayersData)

module.exports = routes;