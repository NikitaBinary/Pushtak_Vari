const express = require("express");
const Router = express.Router();
const authController = require("../controller/signupController");
const signUPController = new authController();

Router.post("/userSingup", signUPController.userSignupController);
Router.post("/userLogin", signUPController.userloginController);
Router.put("/forgotPassword", signUPController.forgotPassordAndOTPController);
Router.put("/verifyOTP", signUPController.verifyOTP);
Router.put("/resetPassword", signUPController.resetPassword);



module.exports = Router;