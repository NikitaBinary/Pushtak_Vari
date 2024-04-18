const express = require("express");
const Router = express.Router();
const multer = require("multer");
const authController = require("../controller/notificationController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const notificationController = new authController();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const uploadStorage = multer({ storage: storage })

Router.post("/createNotification", superAdminAuth, uploadStorage.single("imageUrl"), notificationController.createNotificationController);
Router.get("/getUserTypeList", notificationController.getUserTypeList);
Router.get("/getNotificationList",superAdminAuth,notificationController.getNotificationList)
Router.get("/getNotificationTypeList",notificationController.getNotificationTypeList)

// app side notification api =================================================================

Router.get("/app/getNotificationList",superAdminAuth,notificationController.getNotificationListController)




module.exports = Router