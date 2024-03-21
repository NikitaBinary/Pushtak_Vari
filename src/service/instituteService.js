const institute = require("../model/instituteModel");
const { verifyPassword, getPasswordHash } = require("../helper/passwordHelper");
const { generateToken } = require('../helper/generateToken');
const Mail = require('../helper/mail')
const user = require("../model/userModel")
const bookAssign = require("../model/instituteAssignBook")
const mongoose = require("mongoose")

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
            let instituteDetail = await user.findOne({ _id: _id }, { userType: "INSTITUTE" });
            let instituteInfo = await user.findOneAndUpdate({ _id: _id }, dataBody, { new: true });

            return { instituteDetail, instituteInfo }
        } catch (error) {
            throw error;
        }
    }

    async instituteListService() {
        try {
            const instituteList = await user.find({ userType: "INSTITUTE" },
                {
                    _id: 1, emailId: 1, mobileNo: 1, userType: 1, studentCount: 1, is_active: 1,
                    instituteName: 1, studentList: 1, instituteImage: 1, created_at: 1
                }).sort({ created_at: -1 })
            return instituteList
        } catch (error) {
            throw error;
        }
    }
    async getInstituteInfoService(_id) {
        try {
            let instituteDetail = await user.findOne({ _id: _id }, { userType: "INSTITUTE" });
            if (instituteDetail) {
                let id = instituteDetail._id
                var instituteInfo = await user.findOne(
                    { _id: id, userType: "INSTITUTE" },
                    { _id: 1, emailId: 1, mobileNo: 1, userType: 1, is_active: 1, instituteName: 1, studentList: 1, instituteImage: 1, created_at: 1 }
                );
            }
            return { instituteDetail, instituteInfo }
        } catch (error) {
            throw error;
        }
    }

    async deleteInstituteInfoService(_id) {
        try {
            let instituteInfo = await user.findOne({ _id: _id, userType: "INSTITUTE" });
            if (instituteInfo) {
                var institutedata = await user.findOneAndDelete({ _id, userType: "INSTITUTE" });
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
            let instituteInfo = await user.findOne({ _id: _id, userType: "INSTITUTE" });
            if (instituteInfo) {
                let id = instituteInfo._id
                var institutedata = await user.findByIdAndUpdate(
                    id, { is_active: active }, { new: true }
                );
            }

            return { instituteInfo, institutedata }
        } catch (error) {
            console.log("error------.", error)
            throw error;
        }
    }

    async assignBooktoInstituteService(instituteId, bookId) {
        try {
            const is_instituteExists = await bookAssign.findOne({ instituteID: new mongoose.Types.ObjectId(instituteId) });

            let bookList;

            if (!is_instituteExists) {
                bookList = await bookAssign.create({
                    instituteID: instituteId,
                    BookList: [bookId]
                });
            } else {
                bookList = await bookAssign.findOneAndUpdate(
                    { instituteID: new mongoose.Types.ObjectId(instituteId) },
                    { $addToSet: { BookList: bookId } },
                    { new: true }
                );
            }
            return bookList
        } catch (error) {
            console.log("error------.", error);
            throw error;
        }
    }

    async deleteInstituteBookService(instituteId, bookId) {
        try {
            const is_instituteExists = await bookAssign.findOne({ instituteID: new mongoose.Types.ObjectId(instituteId) });
            if (!is_instituteExists) {
                return { message: "Institute not exists." }
            }
            else{
               var bookList = await bookAssign.findOneAndUpdate(
                    { instituteID: new mongoose.Types.ObjectId(instituteId) },
                    { $pull: { BookList: bookId } },
                    { new: true }
                );
            }
            return bookList

        } catch (error) {
            console.log("error------.", error);
            throw error;
        }
    }


}

module.exports = AuthService;
