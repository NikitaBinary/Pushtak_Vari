const authService = require("../service/quizService");
const quizService = new authService();

class authController {
    async addQuizController(req, res) {
        try {
            const quizInfo = await quizService.addQuizService(req.body);
            return res.json({
                status: 201,
                message: "Quiz has been added successfully!",
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


    async getQuizListController(req, res) {
        try {
            const quizList = await quizService.getQuizListService();

            return res.json({
                status: 200,
                message: "Quiz list get",
                data: quizList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async deleteQuizController(req, res) {
        try {
            let id = req.params.id
            const response = await quizService.deleteQuizService(id);

            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Quiz info deleted",
                data: response
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

}

module.exports = authController