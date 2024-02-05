const express = require("express");
const Router = express.Router();
const authController = require("../controller/quizController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const quizController = new authController();


Router.post("/addQuiz", superAdminAuth, quizController.addQuizController)
Router.get("/getQuestionType", quizController.getQuestionTypeController)
Router.post("/addQuestionOption", superAdminAuth, quizController.addQuestionOptionController)


module.exports = Router