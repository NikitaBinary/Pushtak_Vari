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
Router.post("/userSingup", uploadStorage.single("instituteImage"), signUPController.userSignupController);
Router.post("/userLogin", signUPController.userloginController);
Router.put("/forgotPassword", signUPController.forgotPassordAndOTPController);
Router.put("/verifyOTP", signUPController.verifyOTP);
Router.put("/resetPassword", signUPController.resetPassword);

// user apis -by SuperAdmin------------------------------

Router.get("/userList", superAdminAuth, signUPController.userListController)
Router.put("/updateUser/:id", superAdminAuth,  uploadStorage.fields
([{ name: 'userImage', maxCount: 1 }, { name: 'instituteImage', maxCount: 1 }]), signUPController.updateUserController)
Router.get("/getUserInfo/:id", superAdminAuth, signUPController.getUserInfoController)
Router.delete("/deleteUserInfo/:id", superAdminAuth, signUPController.deleteUserInfoController)
Router.put("/userStatus/:id", superAdminAuth, signUPController.userStatusController)
Router.put("/logout/:id", superAdminAuth, signUPController.logoutController)


/// ----------------------App side Apis-----------------------------------------------------

Router.post("/app/userSingup", uploadStorage.single("instituteImage"), signUPController.userSignupController);
Router.post("/app/userLogin", signUPController.userloginController);
Router.put("/app/forgotPassword", signUPController.forgotPassordAndOTPController);
Router.put("/app/verifyOTP", signUPController.verifyOTP);
Router.put("/app/resetPassword", signUPController.resetPassword);

Router.put("/app/userStatus/:id", superAdminAuth, signUPController.userStatusController)
Router.put("/app/updateUser/:id", superAdminAuth, uploadStorage.fields
([{ name: 'userImage', maxCount: 1 }, { name: 'instituteImage', maxCount: 1 }]), signUPController.updateUserController)
Router.put("/app/logout/:id", superAdminAuth, signUPController.logoutController)
Router.get("/app/userList", superAdminAuth, signUPController.userListController)
Router.get("/app/getUserInfo/:id", superAdminAuth, signUPController.getUserInfoController)
Router.delete("/app/deleteUserInfo/:id", superAdminAuth, signUPController.deleteUserInfoController)

//-----------------social-media apis==================================================================

Router.post("/app/socialMediaSignUp", uploadStorage.single("userImage"), signUPController.socialMediaSignUpController);
Router.put("/app/updateDeviceToken/:id", signUPController.updateDeviceTokenController);
Router.put("/app/updateUserLanguage/:id", signUPController.updateUserLanguageController);


module.exports = Router;