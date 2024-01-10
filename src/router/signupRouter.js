const express = require("express");
const Router = express.Router();
const authController = require("../controller/signupController");
const signUPController = new authController();

Router.post("/userSingup", signUPController.userSignupController);

module.exports = Router;