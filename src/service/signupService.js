const user = require("../model/userModel");
const institute = require("../model/instituteModel");
const { verifyPassword, getPasswordHash } = require("../helper/passwordHelper");
const { generateToken } = require('../helper/generateToken');
const Mail = require('../helper/mail')


class AuthService {

    async verifyUser(query) {
        return await user.findOne(query);
    }
    async userSignupService(userBody) {
        let uniqueEmail = await user.findOne({ emailId: userBody.emailId })
        if (!uniqueEmail) {
            var userDetail = await user.create(userBody);
        }
        return { userDetail, uniqueEmail }
    }

    async instituteUserService(userBody) {
        let uniqueEmail = await user.findOne({ emailId: userBody.emailId })
        userBody.is_instituteUser = true
        if (!uniqueEmail) {
            var userDetail = await user.create(userBody);
        }
        return { userDetail, uniqueEmail }
    }
    async userloginService(userBody) {
        const userInfo = await user.findOne({ emailId: userBody.emailId });
        if (userInfo) {
            console.log("userInfo---------->", userInfo)
            if (userInfo.userType == 'SuperAdmin') {
                let data = await user.findOne({ emailId: userBody.emailId });
                await verifyPassword(userBody.password, data.password);
            }
            if (userInfo.userType == 'insititute_user') {
                let data = await user.findOne({ emailId: userBody.emailId });
                await verifyPassword(userBody.password, data.password);
            }
            var token = await generateToken(
                { email: userInfo.emailId, name: userInfo.fullName, userType: userInfo.userType }
            )
            return {
                token: token,
                instituteInfo
            }
        }
        const instituteInfo = await institute.findOne({ emailId: userBody.emailId });
        if (instituteInfo) {
            console.log("come 22")
            let data = await institute.findOne({ emailId: userBody.emailId });
            await verifyPassword(userBody.password, data.password);

            const token = await generateToken(
                { email: instituteInfo.emailId, name: instituteInfo.instituteName }
            )
            return {
                token: token,
                instituteInfo
            };
        }

        return { message: "Not Found" }

    }

    async forgotPassordAndOTPService(body) {
        try {
            const email = body.emailId;
            let checkOtp = await user.findOne({ emailId: email });
            if (checkOtp) {
                let otp = `${Math.floor(100000 + Math.random() * 999999)}`;
                console.log("otp--------->", otp)
                await user.updateOne({ emailId: email }, { $set: { otp: otp } });
                let mail = new Mail();
                const userName = email.split('@');
                const subject = "Forgot Password";
                const html = `<h3>Hello ${userName[0]}</h3>
                <p> ${otp} is the otp for your ${email} account.</p>
                <p> If you didn't ask to reset your password, you can ignore this email.</p>
                <br>
                <p>Thanks,</p>
                <p>Your Pushtak Vari team </p>`;
                await mail.sendMail(email, html, subject);
                return true;
            }
            console.log("checkOtp--------->", checkOtp)
            let checkInstituteOtp = await institute.findOne({ emailId: email });
            if (checkInstituteOtp) {
                let otp = `${Math.floor(100000 + Math.random() * 999999)}`;
                console.log("otp--------->", otp)
                await institute.updateOne({ emailId: email }, { $set: { otp: otp } });
                let mail = new Mail();
                const userName = email.split('@');
                const subject = "Forgot Password";
                const html = `<h3>Hello ${userName[0]}</h3>
                <p> ${otp} is the otp for your ${email} account.</p>
                <p> If you didn't ask to reset your password, you can ignore this email.</p>
                <br>
                <p>Thanks,</p>
                <p>Your Pushtak Vari team </p>`;
                await mail.sendMail(email, html, subject);
                return true;
            }
            else {
                return false;
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async verifyOTP(body) {
        try {
            const email = body.emailId;
            const otp = body.otp;
            let checkOtp = await user.find({ emailId: email, otp: otp });
            let instituteCheckOtp = await institute.find({ emailId: email, otp: otp });
            console.log("comee innn----------->", instituteCheckOtp)


            if (checkOtp.length > 0) {
                console.log("comee innwwwn------------->", checkOtp)
                await user.updateOne({ _id: checkOtp._id }, { $set: { otp: '' } }, { new: true });
                return true;
            }
            if (instituteCheckOtp.length > 0) {
                console.log("comee innn")
                await institute.updateOne({ _id: checkOtp._id }, { $set: { otp: '' } }, { new: true });
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async resetPassword(body) {
        try {
            const email = body.emailId;
            let checkOtp = await user.findOne({ emailId: email });
            let instituteCheckOtp = await institute.find({ emailId: email, otp: otp });
            if (checkOtp) {
                let password = await getPasswordHash(body.password, 12);
                let userInfo = await user.updateOne({ _id: checkOtp._id }, { $set: { password: password } }, { new: true });
                return true;
            }
            if (instituteCheckOtp) {
                let password = await getPasswordHash(body.password, 12);
                let userInfo = await institute.updateOne({ _id: checkOtp._id }, { $set: { password: password } }, { new: true });
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async userListService() {
        try {
            const userList = await user.find()
            return userList
        } catch (error) {
            throw error;
        }
    }
    async instituteUserListService() {
        try {
            const userList = await user.find({ is_instituteUser: true }, {})
            return userList
        } catch (error) {
            throw error;
        }
    }
    async updateUserService(_id, dataBody) {
        try {
            delete dataBody.email
            let userDetail = await user.findOne({ _id: _id });
            let userInfo = await user.findOneAndUpdate({ _id: _id }, dataBody, { new: true });

            return { userDetail, userInfo }
        } catch (error) {
            throw error;
        }
    }
    async getUserInfoService(_id) {
        try {
            let userDetail = await user.findOne({ _id: _id });
            if (userDetail) {
                var userInfo = await user.findOne({ _id: _id }, {});
            }
            return { userDetail, userInfo }
        } catch (error) {
            throw error;
        }
    }
    async deleteUserService(_id) {
        try {
            let userInfo = await user.findOne({ _id: _id });
            if (userInfo) {
                var userdata = await user.findOneAndDelete({ _id });
            }
            return { userInfo, userdata }
        } catch (error) {
            throw error;
        }
    }

    async userStatusService(_id, status) {
        try {
            function convertStringToBoolean(value) {
                return value === 'true';
            }
            const active = await convertStringToBoolean(status);
            let userInfo = await user.findOne({ _id: _id });
            if (userInfo) {
                var userdata = await user.findByIdAndUpdate(
                    _id, { activeStatus: active }, { new: true }
                );
            }
            return { userInfo, userdata }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService;