const express = require('express');
require('dotenv').config()
const path = require('path');
const router = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const apisRoute = require("./src/indexRoute")
const { dbConnection } = require('./src/database/connectionDb')

// connect to db --------------
dbConnection()

router.use(cors());
router.use(express.json());
router.use(bodyParser.json());

// call the api route ---------------------
router.use('/api/v1',apisRoute)


router.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

module.exports = router;