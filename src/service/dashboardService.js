const user = require("../model/userModel")
const institute = require("../model/instituteModel")

class AuthService {
    async   getUserStatusService() {
        try {
            const activeUserCount = await user.find({ is_active: true }).countDocuments()
            const inActiveUserCount = await user.find({ is_active: false }).countDocuments()
            const totalUser = await user.find({ "userType": { "$nin": ['SUPER_ADMIN', 'INSTITUTE'] } }).countDocuments();
            const totalInstitute = await user.find({ userType: "INSTITUTE" }).countDocuments()


            return { activeUserCount, inActiveUserCount, totalUser, totalInstitute }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AuthService;
