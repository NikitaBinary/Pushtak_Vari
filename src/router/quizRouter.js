const express = require("express");
const Router = express.Router();
const authController = require("../controller/quizController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const quizController = new authController();


Router.post("/addQuiz", superAdminAuth, quizController.addQuizController)
Router.get("/getQuestionType", quizController.getQuestionTypeController)
Router.get("/getQuizList", superAdminAuth, quizController.getQuizListController)
Router.delete("/deleteQuiz/:id", superAdminAuth, quizController.deleteQuizController)


///======================app side apis===================================================

Router.get("/app/getQuizList", superAdminAuth, quizController.getAppQuizListController)


module.exports = Router