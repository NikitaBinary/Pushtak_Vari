const express = require("express");
const Router = express.Router();
const authController = require("../controller/subscriptionController");
const { superAdminAuth } = require('../middleware/superAdminToken');
const subscriptionController = new authController();


Router.post("/addSubscriptionDuration", subscriptionController.addSubscriptionDurationController)
Router.get("/subscriptionDurationList", subscriptionController.subscriptionDurationListController)
Router.post("/addSubscription", superAdminAuth, subscriptionController.addSubscriptionController)
Router.get("/subscriptionList", superAdminAuth, subscriptionController.subscriptionListController)
Router.put("/updateSubscription/:id", superAdminAuth, subscriptionController.updateSubscriptionController)
Router.get("/getSubscriptionInfo/:id", superAdminAuth, subscriptionController.getSubscriptionInfoController)
Router.delete("/deleteSubscription/:id", superAdminAuth, subscriptionController.deleteSubscriptionController)


module.exports = Router;