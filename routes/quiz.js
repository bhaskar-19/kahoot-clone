const express = require('express');
const routes = express.Router();
const auth = require('../middleware/authentication').requireAuth;

const createQuizCtrl = require('../controllers/quiz/createQuiz');
const getAllQuizesCtrl = require('../controllers/quiz/getAllQuizes');
const getQuizByIdCtrl = require('../controllers/quiz/getQuizById');
const updateQuizByIdCtrl = require('../controllers/quiz/updateQuizId');
const deleteQuizByIdCtrl = require('../controllers/quiz/deleteQuizById');
const joinGameCtrl = require('../controllers/quiz/joinGame');

routes.post('/createQuiz',auth, createQuizCtrl.createQuiz);
routes.get('/quizzes',auth, getAllQuizesCtrl.getAllQuizes);
routes.get('/:id',auth, getQuizByIdCtrl.getQuizById);
routes.put('/:id',auth, updateQuizByIdCtrl.updateQuizById);
routes.delete('/:id',auth, deleteQuizByIdCtrl.deleteQuizById);
routes.post('/join',auth, joinGameCtrl.joinGame);


module.exports = routes;