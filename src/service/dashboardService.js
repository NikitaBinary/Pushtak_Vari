const user = require("../model/userModel")
const institute = require("../model/instituteModel")

class AuthService {
    async getUserStatusService() {
        try {
            const activeUserCount = await user.find({ activeStatus: true }).countDocuments()
            const inActiveUserCount = await user.find({ activeStatus: false }).countDocuments()
            const totalUser = await user.find({ "userType": { "$ne": 'SUPER_ADMIN' } }).countDocuments()
            const totalInstitute = await user.find({ userType: "INSTITUTE" }).countDocuments()


            return { activeUserCount, inActiveUserCount, totalUser, totalInstitute }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AuthService;
