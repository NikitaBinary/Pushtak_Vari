const user = require("../model/userModel");

class AuthService {
   
    async userSignupService(userBody) {
        let uniqueEmail = await user.findOne({ email: userBody.email })
        if (!uniqueEmail) {
            var userDetail = await user.create(userBody);
        }
        return { userDetail, uniqueEmail }
    }
}

module.exports = AuthService;