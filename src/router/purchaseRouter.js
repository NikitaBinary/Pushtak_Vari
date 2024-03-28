const express = require("express");
const Router = express.Router();
const authController = require("../controller/purchaseController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const purchaseController = new authController();


Router.post("/app/addToPurchaseBook", superAdminAuth, purchaseController.addToPurchaseBookController);
Router.put("/app/updatePurchaseBook", superAdminAuth, purchaseController.updatePurchaseBookController);
Router.put("/app/multiplePurchaseBook/:id", superAdminAuth, purchaseController.multiplePurchaseBookController);

Router.get("/app/getPurchaseHistory", superAdminAuth, purchaseController.getPurchaseHistoryController);
Router.get("/app/getMoreItem/:id", superAdminAuth, purchaseController.getMoreItemController);
Router.put("/app/updateBookStatus/:id", superAdminAuth, purchaseController.updateBookStatusController);
Router.get("/app/progressbook", superAdminAuth, purchaseController.progressbookController);

//----------------my book =====================================

Router.get("/app/getMyBook/:id", superAdminAuth, purchaseController.getMyBookController);


module.exports = Router;