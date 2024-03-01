const express = require('express');
require('dotenv').config()
const path = require('path');
const router = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const signUpRoute = require("./src/router/signupRouter")
const categoryRoute = require("./src/router/categoryRouter")
const ebookRoute = require("./src/router/ebookRouter")
const instituteRoute = require("./src/router/instituteRouter")
const subscription = require("./src/router/subscriptionRouter")
const notification = require("./src/router/notificationRouter")
const quiz = require("./src/router/quizRouter")
const dashboard = require("./src/router/dashboardRoute")
const cart = require("./src/router/cartRouter")
const purchase = require("./src/router/purchaseRouter")



const { dbConnection } = require('./src/database/connectionDb')

// connect to db --------------
dbConnection()

const corsOptions = {
    origin: '*',
};

router.use(cors(corsOptions));

// router.use(cors());
router.use(express.json());
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));

// router.use('/uploads', express.static(__dirname + 'uploads/'));

router.use('/uploads', express.static('uploads/'));
// call the api route ---------------------
router.use('/api/v1', signUpRoute)
router.use('/api/v1', categoryRoute)
router.use('/api/v1', ebookRoute)
router.use('/api/v1', instituteRoute)
router.use('/api/v1', subscription)
router.use('/api/v1', notification)
router.use('/api/v1', quiz)
router.use('/api/v1', dashboard)
router.use("/api/v1", cart)
router.use("/api/v1", purchase)



router.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

module.exports = router;