const institute = require("../model/instituteModel");
const { verifyPassword, getPasswordHash } = require("../helper/passwordHelper");
const { generateToken } = require('../helper/generateToken');
const Mail = require('../helper/mail')

class AuthService {

    async verifyUser(query) {
        return await institute.findOne(query);
    }
    async createInstituteService(instituteBody, ImageUrl, password) {
        try {
            let uniqueEmail = await institute.findOne({ emailId: instituteBody.emailId })
            if (!uniqueEmail) {
                var instituteDetail = await institute.create({
                    ...instituteBody,
                    instituteImage: ImageUrl,
                });
                const email = instituteBody.emailId
                let checkInstitutePassword = await institute.findOne({ emailId: email });
                if (checkInstitutePassword) {
                    let mail = new Mail();
                    const userName = email.split('@');
                    const subject = "Institute Password";
                    const html = `<h3>Hello ${userName[0]}</h3>
                    <p> Successfully your are registered in Pustak Vari and</p>
                    <p>  this your password ${password}  for login into Pustak Vari</p>
                    <br>
                    <p>Thanks,</p>
                    <p>Your Pushtak Vari team </p>`;
                    await mail.sendMail(email, html, subject);
                    // return true;
                }
            }
            return { instituteDetail, uniqueEmail }
        } catch (error) {
            throw error;
        }
    }

    async updateInstituteService(_id, dataBody, ImageUrl) {
        try {
            delete dataBody.email
            if (ImageUrl) {
                dataBody.instituteImage = ImageUrl
            }
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
