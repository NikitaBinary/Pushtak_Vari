const express = require("express");
const Router = express.Router();
const authController = require("../controller/notificationController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const notificationController = new authController();


Router.post("/createNotification", superAdminAuth, notificationController.createNotificationController);
Router.get("/getUserTypeList", notificationController.getUserTypeList);
Router.get("/getNotificationList",superAdminAuth,notificationController.getNotificationList)
Router.get("/getNotificationTypeList",notificationController.getNotificationTypeList)

// app side notification api =================================================================

Router.get("/app/getNotificationList",superAdminAuth,notificationController.getNotificationListController)




module.exports = Router