const express = require('express');
const routes = express.Router();
const auth = require('../middleware/authentication').requireAuth;

const getAllQuestionsCtrl = require('../controllers/question/getAllQuestions');
const getQuestionByIdCtrl = require('../controllers/question/getQuestionById');
const updateQuestionByIdCtrl = require('../controllers/question/updateQuesionById');
const deleteQuestionByIdCtrl = require('../controllers/question/deleteQuestionById');
const createQuestionCtrl = require('../controllers/question/createQuestion');

routes.get('/:quizId/questions',auth, getAllQuestionsCtrl.getAllQuestions);
routes.get('/:quizId/questions/:questionId', auth, getQuestionByIdCtrl.getQuestionById);
routes.put('/:quizId/:questionId', auth, updateQuestionByIdCtrl.updateQuestionById);
routes.delete('/:quizId/questions/:questionId', auth, deleteQuestionByIdCtrl.deleteQuestionById);
routes.post('/:quizId', auth, createQuestionCtrl.createQuestion);

module.exports = routes;