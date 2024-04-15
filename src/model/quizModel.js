const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    quizName: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    questionCount: {
        type: Number
    },
    solveByUser: {
        type: Number,
        default: 0
    },
    languageInfo: {
        type: JSON
    }
});

quizSchema.index({ quizName: "text" });

const QuizModel = mongoose.model('quiz_detail', quizSchema);

module.exports = QuizModel;
