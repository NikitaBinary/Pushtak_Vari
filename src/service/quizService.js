const questionType = require("../model/questionPatternModel")
const question = require("../model/quizQuestionModel")
const quiz = require("../model/quizModel")
const mongoose = require("mongoose")


class AuthService {
    async addQuizService(quizData) {
        try {
            const quizInfo = await quiz.create(quizData);

            let questionData = [];

            for (const question of quizData.questionText) {
                const typeId = new mongoose.Types.ObjectId(question.questionType);
                const typeInfo = await questionType.findOne({ _id: typeId }, { _id: 1, pattern: 1 });
                questionData.push({
                    questionType: typeInfo,
                    question: question.question,
                    option: question.option,
                    answer: question.answer
                });

            }

            let data = {
                quizId: quizInfo._id,
                questions: questionData
            };
            const quizID = new mongoose.Types.ObjectId(quizInfo._id);
            let count = questionData.length

            await quiz.findOneAndUpdate(
                { _id: quizID },
                {
                    $set: {
                        questionCount: count
                    }
                },
                {
                    new: true,
                    lean: true,
                }
            )

            const quizQuestion = await question.create(data)
            return { quizInfo, quizQuestion }

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


    async getQuizListService() {
        try {
            const quizList = await quiz.find(
                {},
                { _id: 1, quizName: 1, description: 1, questionCount: 1, solveByUser: 1 }
            )
            return quizList
        } catch (error) {
            throw error;
        }
    }

    async deleteQuizService(_id) {
        try {
            let quizInfo = await quiz.findOne({ _id: _id });
            if (quizInfo) {
                var quizData = await quiz.findOneAndDelete({ _id });
                if (quizData) {
                    await question.findOneAndDelete({ quizId: _id })
                }
                return quizData
            }
            return { message: "Quiz not found" }
        } catch (error) {
            throw error;
        }
    }

    async getAppQuizListService() {
        try {

            const questionAggregate = [
                {
                    $lookup: {
                        from: 'quiz_questions',
                        localField: "_id",
                        foreignField: "quizId",
                        as: "quizData"
                    }
                },
                {
                    $unwind: "$quizData"
                },
                {
                    $project: {
                        _id: 1,
                        quizName: 1,
                        description: 1,
                        questionCount: 1,
                        question: "$quizData.questions"
                    }
                }
            ]

            const quizDetail = await quiz.aggregate(questionAggregate)

            return quizDetail

            // const quizList = await quiz.find(
            //     {},
            //     { _id: 1, quizName: 1, description: 1, questionCount: 1, solveByUser: 1 }
            // )
            // return quizList
        } catch (error) {
            throw error;
        }
    }

    async updateQuizUserCountService(quizId) {
        try {
            const is_quizExists = await quiz.findOne({ _id: new mongoose.Types.ObjectId(quizId) })
            if (!is_quizExists) {
                return { message: "Quiz not exists." }
            }
            else {
                var updateUserCount = await quiz.findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(quizId) },
                    { $inc: { solveByUser: 1 } },
                    { new: true }
                )
            }
            return updateUserCount
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService