const express = require('express');
const routes = express.Router();

const createQuizCtrl = require('../controllers/quiz/createQuiz');
const getAllQuizesCtrl = require('../controllers/quiz/getAllQuizes');
const getQuizByIdCtrl = require('../controllers/quiz/getQuizById');
const updateQuizByIdCtrl = require('../controllers/quiz/updateQuizId');
const deleteQuizByIdCtrl = require('../controllers/quiz/deleteQuizById');
const joinGameCtrl = require('../controllers/quiz/joinGame');

routes.post('/createQuiz', createQuizCtrl.createQuiz);
routes.get('/quizzes', getAllQuizesCtrl.getAllQuizes);
routes.get('/:id', getQuizByIdCtrl.getQuizById);
routes.put('/:id', updateQuizByIdCtrl.updateQuizById);
routes.delete('/:id', deleteQuizByIdCtrl.deleteQuizById);
routes.post('/join', joinGameCtrl.joinGame);


module.exports = routes;