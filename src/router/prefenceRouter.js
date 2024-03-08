const express = require("express");
const Router = express.Router();
const authController = require("../controller/prefenceController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const prefenceController = new authController();


Router.get("/app/myPrefence", superAdminAuth, prefenceController.myPrefenceController);
Router.put("/app/resetMyPrefrence/:id", superAdminAuth, prefenceController.updateMyPrefenceController);


module.exports = Router;