const institute = require("../model/instituteModel");
const { verifyPassword, getPasswordHash } = require("../helper/passwordHelper");
const { generateToken } = require('../helper/generateToken');
const Mail = require('../helper/mail')

class AuthService {

    async verifyUser(query) {
        return await institute.findOne(query);
    }
    async createInstituteService(instituteBody) {
        try {
            let uniqueEmail = await institute.findOne({ emailId: instituteBody.emailId })
            if (!uniqueEmail) {
                var instituteDetail = await institute.create(instituteBody);
            }
            return { instituteDetail, uniqueEmail }
        } catch (error) {
            throw error;
        }
    }

    async loginInstituteService(instituteBody) {
        const instituteInfo = await institute.findOne({ emailId: instituteBody.emailId });
        if (!instituteInfo) {
            return instituteInfo
        }
        else {
            let data = await institute.findOne({ emailId: instituteBody.emailId });
            await verifyPassword(instituteBody.password, data.password);
        }
        const token = await generateToken(
            { email: instituteInfo.emailId, name: instituteInfo.instituteName, instituteType: instituteInfo.instituteType }
        )
        return {
            token: token,
            instituteInfo
        };
    }

    async forgotPassordAndOTPService(body) {
        try {
            const email = body.emailId;
            let checkOtp = await institute.findOne({ emailId: email });
            console.log("checkOtp--------->", checkOtp)
            if (!checkOtp) {
                return false;
            }
            let otp = `${Math.floor(100000 + Math.random() * 999999)}`;
            console.log("otp--------->", otp)
            await institute.updateOne({ email: email }, { $set: { otp: otp } });
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
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async verifyOTP(body) {
        try {
            const email = body.emailId;
            const otp = body.otp;
            let checkOtp = await institute.find({ emailId: email, otp: otp });
            if (checkOtp) {
                await institute.updateOne({ _id: checkOtp._id }, { $set: { otp: '' } }, { new: true });
                return true;
            } else {
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
            let checkOtp = await institute.findOne({ emailId: email });
            if (checkOtp) {
                let password = await getPasswordHash(body.password, 12);
                let userInfo = await institute.updateOne({ _id: checkOtp._id }, { $set: { password: password } }, { new: true });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async updateInstituteService(_id, dataBody) {
        try {
            delete dataBody.email
            let instituteDetail = await institute.findOne({ _id: _id });
            let instituteInfo = await institute.findOneAndUpdate({ _id: _id }, dataBody, { new: true });

            return { instituteDetail, instituteInfo }
        } catch (error) {
            throw error;
        }
    }

    async instituteListService() {
        try {
            const instituteList = await institute.find()
            return instituteList
        } catch (error) {
            throw error;
        }
    }
    async getInstituteInfoService(_id) {
        try {
            let instituteDetail = await institute.findOne({ _id: _id });
            if (instituteDetail) {
                var instituteInfo = await institute.findOne({ _id: _id }, {});
            }
            return { instituteDetail, instituteInfo }
        } catch (error) {
            throw error;
        }
    }

    async deleteInstituteInfoService(_id) {
        try {
            let instituteInfo = await institute.findOne({ _id: _id });
            if (instituteInfo) {
                var institutedata = await institute.findOneAndDelete({ _id });
            }
            return { instituteInfo, institutedata }
        } catch (error) {
            throw error;
        }
    }

    async instituteStatusService(_id, status) {
        try {
            function convertStringToBoolean(value) {
                return value === 'true';
            }
            const active = await convertStringToBoolean(status);
            let instituteInfo = await institute.findOne({ _id: _id });
            if (instituteInfo) {
                var institutedata = await institute.findByIdAndUpdate(
                    _id, { is_active: active }, { new: true }
                );
            }
            return { instituteInfo, institutedata }
        } catch (error) {
            console.log("error------.", error)
            throw error;
        }
    }

}

module.exports = AuthService;
