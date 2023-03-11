const express = require('express');
const routes = express.Router();
const auth = require('../middleware/authentication').requireAuth;

const gamesCtrl = require('../controllers/game/games');
const playerGamesCtrl = require('../controllers/game/playerGames');
const batchBoardCtrl = require('../controllers/game/batchLeaderboard');

routes.get('/:creator',auth, gamesCtrl.games);
routes.get('/games/:quizId',auth, gamesCtrl.gameQuizData);
routes.get('/players/:quizId/:gameId', auth, gamesCtrl.gamePlayersData);
routes.get('/playerGames/:playerId', auth, playerGamesCtrl.playerGames);
routes.get('/batchBoard/:batchId', auth, batchBoardCtrl.batchLeaderBoard);

module.exports = routes;