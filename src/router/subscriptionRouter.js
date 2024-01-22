const express = require("express");
const Router = express.Router();
const authController = require("../controller/subscriptionController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const subscriptionController = new authController();


Router.post("/addSubscriptionDuration", subscriptionController.addSubscriptionDurationController)
Router.get("/subscriptionDurationList", subscriptionController.subscriptionDurationListController)
Router.post("/addSubscription", subscriptionController.addSubscriptionController)
Router.get("/subscriptionList", subscriptionController.subscriptionListController)
Router.put("/updateSubscription/:id", subscriptionController.updateSubscriptionController)
Router.get("/getSubscriptionInfo/:id", subscriptionController.getSubscriptionInfoController)
Router.delete("/deleteSubscription/:id", subscriptionController.deleteSubscriptionController)


module.exports = Router;