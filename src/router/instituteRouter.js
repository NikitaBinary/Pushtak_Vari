const express = require("express");
const Router = express.Router();
const authController = require("../controller/instituteController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const instituteController = new authController();



Router.post("/createInstitute", superAdminAuth, instituteController.createInstituteController)
Router.get("/instituteList", superAdminAuth, instituteController.instituteListController)
Router.put("/updateInstitute/:id", superAdminAuth, instituteController.updateInstituteController)
Router.get("/getInstituteInfo/:id", superAdminAuth, instituteController.getInstituteInfoController)
Router.delete("/deleteInstituteInfo/:id", superAdminAuth, instituteController.deleteInstituteInfoController)
Router.put("/instituteStatus/:id", superAdminAuth, instituteController.instituteStatusController)



module.exports = Router;