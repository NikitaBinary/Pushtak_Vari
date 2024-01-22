const express = require("express");
const Router = express.Router();
const authController = require("../controller/instituteController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const instituteController = new authController();



Router.post("/createInstitute", instituteController.createInstituteController)
Router.get("/instituteList", instituteController.instituteListController)
Router.put("/updateInstitute/:id", instituteController.updateInstituteController)
Router.get("/getInstituteInfo/:id", instituteController.getInstituteInfoController)
Router.delete("/deleteInstituteInfo/:id", instituteController.deleteInstituteInfoController)
Router.put("/instituteStatus/:id", instituteController.instituteStatusController)



module.exports = Router;