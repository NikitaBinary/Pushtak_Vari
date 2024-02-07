const mongoose = require('mongoose');

const quizOptionSchema = new mongoose.Schema({
    quizId: {
        type: String,
    },
    questions: {
        type: Array,
        default: []
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const quizOption = mongoose.model("quiz_question", quizOptionSchema);
module.exports = quizOption;