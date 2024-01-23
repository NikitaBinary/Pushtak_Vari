const express = require("express");
const Router = express.Router();
const multer = require("multer");
const authController = require("../controller/categoryController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const categoryController = new authController();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const uploadStorage = multer({ storage: storage })

Router.post("/addCategory", uploadStorage.single("file"), categoryController.addCategoryController);
Router.get("/categoryList", categoryController.categoryListController)


module.exports = Router;