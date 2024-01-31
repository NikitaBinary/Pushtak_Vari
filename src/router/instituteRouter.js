const express = require("express");
const Router = express.Router();
const multer = require("multer");
const authController = require("../controller/instituteController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const instituteController = new authController();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const uploadStorage = multer({ storage: storage })


// main api -------------------------------------------
Router.post("/createInstitute", superAdminAuth, uploadStorage.single("instituteImage"), instituteController.createInstituteController)
Router.get("/instituteList", superAdminAuth, instituteController.instituteListController)
Router.put("/updateInstitute/:id", superAdminAuth, uploadStorage.single("instituteImage"), instituteController.updateInstituteController)
Router.get("/getInstituteInfo/:id", superAdminAuth, instituteController.getInstituteInfoController)
Router.delete("/deleteInstituteInfo/:id", superAdminAuth, instituteController.deleteInstituteInfoController)
Router.put("/instituteStatus/:id", superAdminAuth, instituteController.instituteStatusController)

module.exports = Router;