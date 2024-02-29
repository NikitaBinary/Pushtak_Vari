const express = require("express");
const Router = express.Router();
const authController = require("../controller/purchaseController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const purchaseController = new authController();


Router.post("/addToPurchaseBook", superAdminAuth, purchaseController.addToPurchaseBookController);


module.exports = Router;