const authService = require("../service/quizService");
const quizService = new authService();

class authController {
    async addQuizController(req, res) {
        try {
            const quizInfo = await quizService.addQuizService(req.body);
            return res.json({
                status: 201,
                message: "ebookType has been added successfully!",
                data: quizInfo
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async getQuestionTypeController(req, res) {
        try {
            const questionTypeList = await quizService.getQuestionTypeService();

            return res.json({
                status: 200,
                message: "Question type list get",
                data: questionTypeList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async addQuestionOptionController(req, res) {
        try {
            const optionInfo = await quizService.addQuestionOptionService(req.body);
            return res.json({
                status: 201,
                message: "Option has been added successfully!",
                data: optionInfo
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

}

module.exports = authController