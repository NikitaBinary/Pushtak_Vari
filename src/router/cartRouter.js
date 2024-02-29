const express = require("express");
const Router = express.Router();
const authController = require("../controller/cartController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const cartController = new authController();


Router.post("/addBookToCart", superAdminAuth, cartController.addBookToCartController);
Router.get("/cartBookList", superAdminAuth, cartController.cartBookListController);
Router.delete("/deleteCartBook/:id", superAdminAuth, cartController.deleteCartBookController);
// Router.put("/updateCart", superAdminAuth, cartController.updateCartBuyBook);


module.exports = Router;