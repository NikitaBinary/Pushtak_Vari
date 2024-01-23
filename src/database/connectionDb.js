require('dotenv').config()
const mongoose = require('mongoose');

module.exports.dbConnection = async () => {
    try {
        // mongoose.set('debug', true);
        mongoose.set("strictQuery", true);
        await mongoose.connect(process.env.Server_DB_Url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        console.log("connected")
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports.close = async () => {
    await mongoose.disconnect();
    console.log('Database disconnected');
};
