const express = require("express");
const Router = express.Router();
const authController = require("../controller/dashboardController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const dashboardController = new authController();


Router.get("/getUserStatusCount", superAdminAuth, dashboardController.getUserStatusController)


module.exports = Router