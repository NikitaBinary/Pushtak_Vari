const express = require("express");
const Router = express.Router();
const multer = require("multer");
const authController = require("../controller/ebookController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const ebookController = new authController();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const uploadStorage = multer({ storage: storage })

Router.post("/addEbookType", ebookController.addEbookTypeController)
Router.get("/ebookTypeList", ebookController.ebookTypeListController)
Router.post("/createEbook", uploadStorage.single("bookImage"), ebookController.createEbookController)
Router.put("/updateEbook/:id", uploadStorage.single("bookImage"), ebookController.updateEbookController)
Router.delete("/deleteEbook/:id", ebookController.deleteEbookController)
Router.get("/getEbookList", ebookController.getEbookListController)
Router.get("/getEbookInfo/:id", ebookController.getEbookInfoController)



module.exports = Router;