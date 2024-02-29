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
Router.get("/ebooklanguageList", ebookController.ebooklanguageListController)

Router.post("/createEbook", superAdminAuth, uploadStorage.fields
    ([{ name: 'bookImage', maxCount: 1 }, { name: 'bookPdf', maxCount: 1 }]), ebookController.createEbookController)
Router.put("/updateEbook/:id", superAdminAuth, uploadStorage.fields
    ([{ name: 'bookImage', maxCount: 1 }, { name: 'bookPdf', maxCount: 1 }]), ebookController.updateEbookController)
Router.delete("/deleteEbook/:id", superAdminAuth, ebookController.deleteEbookController)
Router.get("/getEbookList", superAdminAuth, ebookController.getEbookListController)
Router.get("/getEbookInfo/:id", superAdminAuth, ebookController.getEbookInfoController)

//==================App Side Apis ==========================================================

Router.get("/app/getEbookList", superAdminAuth, ebookController.getAppEbookListController)
Router.get("/app/exploreBookList", superAdminAuth, ebookController.exploreBookListController)


//=================== app side apis of review======================================================

Router.post("/app/addReview", superAdminAuth,ebookController.addReviewController)
Router.get("/app/e-bookInfo/:id",superAdminAuth,ebookController.eBookInfoController)


module.exports = Router;