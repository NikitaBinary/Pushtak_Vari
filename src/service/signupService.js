const user = require("../model/userModel");
const institute = require("../model/instituteModel");
const { verifyPassword, getPasswordHash } = require("../helper/passwordHelper");
const { generateToken } = require('../helper/generateToken');
const Mail = require('../helper/mail')


class AuthService {

    async verifyUser(query) {
        return await user.findOne(query);
    }
    async userSignupService(userBody, userPassword, institute_Image) {
        try {
            let uniqueEmail = await user.findOne({ emailId: userBody.emailId })
            let uniqueMobileNo = await user.findOne({ mobileNo: userBody.mobileNo })
           
            if (!uniqueEmail && !uniqueMobileNo) {
          
                if (userBody.userType == 'SUPER_ADMIN') {
                    var superObj = {
                        fullName: userBody.fullName,
                        emailId: userBody.emailId,
                        mobileNo: userBody.mobileNo,
                        password: userBody.password,
                        userType: userBody.userType,
                        is_instituteUser: null,
                        userImage: ""
                    }
                    var userDetail = await user.create(superObj);
                }

                if (userBody.userType == 'INSTITUTE_USER') {
                    var institUser = {
                        fullName: userBody.fullName,
                        emailId: userBody.emailId,
                        mobileNo: userBody.mobileNo,
                        password: userBody.password,
                        userType: userBody.userType,
                        is_instituteUser: true,
                        userImage: ""
                    }
                    var userDetail = await user.create(institUser);
                }
                if (userBody.userType == 'INSTITUTE') {
                    var institUser = {
                        instituteName: userBody.instituteName,
                        emailId: userBody.emailId,
                        mobileNo: userBody.mobileNo,
                        password: userBody.password,
                        userType: userBody.userType,
                        is_active: true,
                        studentList: [],
                        // instituteImage: institute_Image
                    }

                    if (institute_Image) {
                        institUser.instituteImage = institute_Image
                    }

                    var userDetail = await user.create(institUser);
                }
                if (userPassword) {
                    const email = userBody.emailId;
                    let checkPassword = await user.findOne({ emailId: email });
                    if (checkPassword) {
                        let mail = new Mail();
                        const userName = email.split('@');
                        const subject = "User Password";
                        const html = `<h3>Hello ${userName[0]}</h3>
                        <p> Successfully your are registered in Pustak Vari and</p>
                        <p>  this your password ${userPassword}  for login into Pustak Vari</p>
                        <br>
                        <p>Thanks,</p>
                        <p>Your Pushtak Vari team </p>`;
                        await mail.sendMail(email, html, subject);
                    }
                }
            }
            return { userDetail, uniqueEmail, uniqueMobileNo }
        } catch (error) {
            console.log(error);
            throw error;
        }

    }


    async userloginService(userBody) {
        const userInfo = await user.findOne({ emailId: userBody.emailId });
        if (userInfo) {
            let data;
            switch (userInfo.userType) {
                case 'SUPER_ADMIN':
                case 'INSTITUTE_USER':
                case 'INSTITUTE':
                    data = await user.findOne({ emailId: userBody.emailId });
                    await verifyPassword(userBody.password, data.password);
                    break;
                default:
                    return { message: "Invalid user access." };
            }
            var token = await generateToken(
                { email: userInfo.emailId, name: userInfo.fullName }
            )
            return {
                token: token,
                userInfo
            }
        }


        return { message: "Not Found" }

    }

    async forgotPassordAndOTPService(body) {
        try {
            const email = body.emailId;
            let checkOtp = await user.findOne({ emailId: email });
            if (checkOtp) {
                let otp = `${Math.floor(1000 + Math.random() * 9000)}`;
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

            if (checkOtp.length > 0) {
                await user.updateOne({ _id: checkOtp._id }, { $set: { otp: '' } }, { new: true });
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
            let instituteCheckOtp = await institute.findOne({ emailId: email });
            if (checkOtp) {
                let password = await getPasswordHash(body.password, 12);
                let userInfo = await user.updateOne({ _id: checkOtp._id }, { $set: { password: password } }, { new: true });
                return true;
            }
            if (instituteCheckOtp) {
                let password = await getPasswordHash(body.password, 12);
                let userInfo = await institute.updateOne({ _id: instituteCheckOtp._id }, { $set: { password: password } }, { new: true });
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

    async userListService(status) {
        try {
            let userList
            if (status) {
                userList = await user.find({ is_instituteUser: status }, { "userType": { "$ne": 'INSTITUTE' } },
                    { fullName: 1, emailId: 1, mobileNo: 1, password: 1, userType: 1, is_instituteUser: 1, userImage: 1, is_active: 1 })
            }
            else {
                userList = await user.find({ "userType": { "$ne": 'INSTITUTE' } },
                    { fullName: 1, emailId: 1, mobileNo: 1, password: 1, userType: 1, is_instituteUser: 1, userImage: 1, is_active: 1 })
            }
            return userList
        } catch (error) {
            throw error;
        }
    }

    async updateUserService(_id, dataBody, ImageUrl) {
        try {
            delete dataBody.email
            let userDetail = await user.findOne({ _id: _id }, { "userType": { "$ne": 'INSTITUTE' } });
            if (userDetail) {
                var id = userDetail._id
            }
            let userInfo = await user.findOneAndUpdate({ _id: id }, dataBody, { new: true });
            if (ImageUrl) {
                userInfo = await user.findOneAndUpdate({ _id: IDBFactory },
                    {
                        $set: {
                            userImage: ImageUrl
                        }
                    },
                    { new: true });
            }

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
                    _id, { is_active: active }, { new: true }
                );
            }
            return { userInfo, userdata }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService;