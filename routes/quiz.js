const express = require('express');
const routes = express.Router();
const auth = require('../middleware/authentication').requireAuth;

const createQuizCtrl = require('../controllers/quiz/createQuiz');
const getAllQuizesCtrl = require('../controllers/quiz/getAllQuizes');
const getQuizByIdCtrl = require('../controllers/quiz/getQuizById');
const updateQuizByIdCtrl = require('../controllers/quiz/updateQuizId');
const deleteQuizByIdCtrl = require('../controllers/quiz/deleteQuizById');
const joinGameCtrl = require('../controllers/game/joinGame');
const getAllUserQuizesCtrl = require('../controllers/quiz/getAllUserQuizes');

routes.post('/createQuiz',auth, createQuizCtrl.createQuiz);
routes.get('/quizzes',auth, getAllQuizesCtrl.getAllQuizes);
routes.get('/quizzes/:creator',auth, getAllUserQuizesCtrl.getAllUserQuizes);
routes.get('/:quizId',auth, getQuizByIdCtrl.getQuizById);
routes.put('/:quizId',auth, updateQuizByIdCtrl.updateQuizById);
routes.delete('/:quizId',auth, deleteQuizByIdCtrl.deleteQuizById);
routes.post('/join',auth, joinGameCtrl.joinGame);


module.exports = routes;