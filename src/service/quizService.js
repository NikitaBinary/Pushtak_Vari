const questionType = require("../model/questionPatternModel")
const question = require("../model/quizQuestionModel")
const quiz = require("../model/quizModel")


class AuthService {
    async addQuizService(quizData) {
        try {
            const quizInfo = await quiz.create(quizData);
            let data = {
                quizId: quizInfo._id,
                question: quizData.questionText
            }
            console.log("daya---------->", data)
            const quizQuestion = await question.create(data)
            return quizInfo

        } catch (error) {
            throw error;
        }
    }
    async getQuestionTypeService() {
        try {
            const questionTypeList = await questionType.find()
            return questionTypeList
        } catch (error) {
            throw error;
        }
    }
    async addQuestionOptionService(optionData) {
        try {
            const optionInfo = await quizOption.create(optionData);
            return optionInfo

        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService