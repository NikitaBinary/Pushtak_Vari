const user = require("../model/userModel")

class AuthService {
    async getUserStatusService() {
        try {
            const activeUserCount = await user.find({ activeStatus: true }).countDocuments()
            const inActiveUserCount = await user.find({ activeStatus: false }).countDocuments()

            return { activeUserCount, inActiveUserCount }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AuthService;
