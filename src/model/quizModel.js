const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

const QuizModel = mongoose.model('quiz_detail', quizSchema);

module.exports = QuizModel;
