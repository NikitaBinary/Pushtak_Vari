const express = require("express");
const Router = express.Router();
const multer = require("multer");
const authController = require("../controller/signupController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const signUPController = new authController();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const uploadStorage = multer({ storage: storage })

// login apis---------------------------
Router.post("/userSingup", uploadStorage.fields
([{ name: 'userImage', maxCount: 1 }, { name: 'instituteImage', maxCount: 1 }]), signUPController.userSignupController);
Router.post("/userLogin", signUPController.userloginController);
Router.put("/forgotPassword", signUPController.forgotPassordAndOTPController);
Router.put("/verifyOTP", signUPController.verifyOTP);
Router.put("/resetPassword", signUPController.resetPassword);

// user apis -by SuperAdmin------------------------------

Router.get("/userList", superAdminAuth, signUPController.userListController)
Router.put("/updateUser/:id", superAdminAuth, uploadStorage.single("userImage"), signUPController.updateUserController)
Router.get("/getUserInfo/:id", superAdminAuth, signUPController.getUserInfoController)
Router.delete("/deleteUserInfo/:id", superAdminAuth, signUPController.deleteUserInfoController)
Router.put("/userStatus/:id", superAdminAuth, signUPController.userStatusController)


module.exports = Router;