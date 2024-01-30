const express = require("express");
const Router = express.Router();
const authController = require("../controller/signupController");
const { superAdminAuth, insitituteAuth } = require('../middleware/superAdminToken');
const signUPController = new authController();

// login apis---------------------------
Router.post("/userSingup", signUPController.userSignupController);
Router.post("/userLogin", signUPController.userloginController);
Router.put("/forgotPassword", signUPController.forgotPassordAndOTPController);
Router.put("/verifyOTP", signUPController.verifyOTP);
Router.put("/resetPassword", signUPController.resetPassword);

// user apis -by SuperAdmin------------------------------

Router.post("/createUser", superAdminAuth, signUPController.userSignupController);
Router.get("/userList", superAdminAuth, signUPController.userListController)
Router.put("/updateUser/:id", superAdminAuth, signUPController.updateUserController)
Router.get("/getUserInfo/:id", superAdminAuth, signUPController.getUserInfoController)
Router.delete("/deleteUserInfo/:id", superAdminAuth, signUPController.deleteUserInfoController)
Router.put("/userStatus/:id", superAdminAuth, signUPController.userStatusController)

// user apis by institute ---------------------------------------
Router.post("/instituteCreateUser", insitituteAuth, signUPController.instituteCreateUserController);
Router.get("/instituteUserList", insitituteAuth, signUPController.instituteUserListController)
Router.put("/instituteUpdateUser/:id", insitituteAuth, signUPController.updateUserController)
Router.get("/instituteUpdateUserInfo/:id", insitituteAuth, signUPController.getUserInfoController)
Router.delete("/instituteDeleteUserInfo/:id", insitituteAuth, signUPController.deleteUserInfoController)
Router.put("/instituteUserStatus/:id", insitituteAuth, signUPController.userStatusController)




module.exports = Router;