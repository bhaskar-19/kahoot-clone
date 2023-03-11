const mongoose = require('mongoose');


const quizSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    creator :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }]
});

const questionSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    options:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
    }],
    correctOption:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
    },
    quiz:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }
});

const optionSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    isCorrect:{
        type: Boolean,
        required: true
    },
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }
});

const quizModel = mongoose.model('Quiz', quizSchema);
const questionModel = mongoose.model('Question', questionSchema);
const optionModel = mongoose.model('Option', optionSchema);

module.exports = {quizModel, questionModel, optionModel};

