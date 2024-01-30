const express = require("express");
const Router = express.Router();
const authController = require("../controller/instituteController");
const { superAdminAuth, insitituteAuth } = require('../middleware/superAdminToken');
const instituteController = new authController();

//login apis---------------------------------
Router.post("/loginInstitute", instituteController.loginInstituteController)
Router.put("/forgotInstitutePassword", instituteController.forgotPassword);
Router.put("/instituteVerifyOTP", instituteController.verifyOTP);
Router.put("/instituteResetPassword", instituteController.resetPassword);

// main api -------------------------------------------
Router.post("/createInstitute", superAdminAuth, instituteController.createInstituteController)
Router.get("/instituteList", superAdminAuth, instituteController.instituteListController)
Router.put("/updateInstitute/:id", superAdminAuth, instituteController.updateInstituteController)
Router.get("/getInstituteInfo/:id", superAdminAuth, instituteController.getInstituteInfoController)
Router.delete("/deleteInstituteInfo/:id", superAdminAuth, instituteController.deleteInstituteInfoController)
Router.put("/instituteStatus/:id", superAdminAuth, instituteController.instituteStatusController)

module.exports = Router;