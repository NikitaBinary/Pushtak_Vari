const express = require("express");
const Router = express.Router();
const authController = require("../controller/signupController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const signUPController = new authController();

// login apis---------------------------
Router.post("/userSingup", signUPController.userSignupController);
Router.post("/userLogin", signUPController.userloginController);
Router.put("/forgotPassword", signUPController.forgotPassordAndOTPController);
Router.put("/verifyOTP", signUPController.verifyOTP);
Router.put("/resetPassword", signUPController.resetPassword);

// user apis -------------------------------

Router.post("/createUser", superAdminAuth, signUPController.userSignupController);
Router.get("/userList", superAdminAuth, signUPController.userListController)
Router.put("/updateUser/:id", superAdminAuth, signUPController.updateUserController)
Router.get("/getUserInfo/:id", superAdminAuth, signUPController.getUserInfoController)
Router.delete("/deleteUserInfo/:id", superAdminAuth, signUPController.deleteUserInfoController)
Router.put("/userStatus/:id", superAdminAuth, signUPController.userStatusController)



module.exports = Router;