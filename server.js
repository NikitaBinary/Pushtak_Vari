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



const { dbConnection } = require('./src/database/connectionDb')

// connect to db --------------
dbConnection()

router.use(cors());
router.use(express.json());
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));

router.use('/uploads', express.static(__dirname + 'uploads/'));

// call the api route ---------------------
router.use('/api/v1', signUpRoute)
router.use('/api/v1', categoryRoute)
router.use('/api/v1', ebookRoute)
router.use('/api/v1', instituteRoute)
router.use('/api/v1', subscription)



router.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

module.exports = router;