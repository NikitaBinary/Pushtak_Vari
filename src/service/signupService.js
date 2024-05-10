const user = require("../model/userModel");
const mongoose = require("mongoose")
const institute = require("../model/instituteModel");
const { verifyPassword, getPasswordHash } = require("../helper/passwordHelper");
const { generateToken } = require('../helper/generateToken');
const Mail = require('../helper/mail')
const subscription = require("../model/subscriptionModel")
const session = require("../model/userSessionModel")
const bookAccess_userCount = require("../model/bookAccessCount")


class AuthService {

    async verifyUser(query) {
        return await user.findOne(query);
    }
    async userSignupService(userBody, userPassword, institute_Image) {
        try {
            let uniqueEmail = await user.findOne({ emailId: userBody.emailId });
            let uniqueMobileNo = await user.findOne({ mobileNo: userBody.mobileNo });
            let userDetail;

            if (!uniqueEmail && !uniqueMobileNo) {
                let newUser;

                switch (userBody.userType) {
                    case 'SUPER_ADMIN':
                        newUser = {
                            fullName: userBody.fullName,
                            emailId: userBody.emailId,
                            mobileNo: userBody.mobileNo,
                            password: userBody.password,
                            userType: userBody.userType,
                            is_instituteUser: null,
                            userImage: "",
                            is_active: true
                        };
                        break;
                    case 'INSTITUTE_USER':
                        newUser = {
                            fullName: userBody.fullName,
                            emailId: userBody.emailId,
                            mobileNo: userBody.mobileNo,
                            password: userBody.password,
                            userType: userBody.userType,
                            is_instituteUser: true,
                            is_active: true,
                            userImage: "",
                            createdBy: userBody.createdBy || '',

                        };
                        break;
                    case 'REGULAR_USER':
                        newUser = {
                            fullName: userBody.fullName,
                            emailId: userBody.emailId,
                            mobileNo: userBody.mobileNo,
                            password: userBody.password,
                            userType: userBody.userType,
                            is_instituteUser: false,
                            is_active: true,
                            userImage: "",
                            createdBy: userBody.createdBy || '',
                        };
                        break; // Add break here
                    case 'INSTITUTE':
                        newUser = {
                            instituteName: userBody.instituteName,
                            emailId: userBody.emailId,
                            mobileNo: userBody.mobileNo,
                            password: userBody.password,
                            userType: userBody.userType,
                            is_active: true,
                            studentList: [],
                            instituteImage: institute_Image || "",
                            studentCount: 0
                        };
                        break;
                    default:
                        throw new Error("Invalid userType");
                }
                userDetail = await user.create(newUser);
                const createDate = userDetail.created_at
                if (userDetail && userDetail.userType == 'INSTITUTE') {
                    var subscriptionInfo = userBody.select_Subscription ? await subscription.findOne({ _id: userBody.select_Subscription }, { duration: 1, no_of_Users: 1, no_of_Books: 1 }) : null;
                    console.log("subscriptionInfo--------------->", subscriptionInfo)
                    var expiryDate
                    if (subscriptionInfo.duration == 0) {
                        expiryDate = null
                    }
                    else {
                        const subscriptDate = new Date(createDate)
                        const subscriptTime = Number(subscriptionInfo.duration)

                        expiryDate = new Date(subscriptDate);
                        expiryDate.setFullYear(subscriptDate.getFullYear() + subscriptTime);
                    }
                    userDetail = await user.findOneAndUpdate(
                        { _id: userDetail._id },
                        {
                            $set: {
                                select_Subscription: subscriptionInfo,
                                subscriptionExpire: expiryDate,
                                is_subscribed: subscriptionInfo ? true : false,
                                no_of_user: subscriptionInfo ? subscriptionInfo.no_of_Users : 0,
                                no_of_books: subscriptionInfo ? subscriptionInfo.no_of_Books : 0
                            }
                        }, {
                        new: true
                    }
                    )
                }

                if (userDetail && userDetail.userType == 'INSTITUTE_USER') {
                    const instituteID = userBody.createdBy
                    var giveSubscription = instituteID ? await user.findOne({ _id: instituteID }, { _id: 1, select_Subscription: 1, created_at: 1, subscriptionExpire: 1 }) : null;
                    if (giveSubscription) {
                        userDetail = await user.findOneAndUpdate(
                            { _id: userDetail._id },
                            {
                                $set: {
                                    select_Subscription: giveSubscription.select_Subscription,
                                    subscriptionExpire: giveSubscription.subscriptionExpire,
                                    is_subscribed: true
                                }
                            }, {
                            new: true
                        }
                        )
                    }
                }

                if (newUser.createdBy) {
                    let id = newUser.createdBy
                    const studeNumber
                        = await user.findOneAndUpdate(
                            { _id: id },
                            { $inc: { studentCount: 1 } },
                            { new: true }
                        )
                }
                if (userPassword) {
                    const email = userBody.emailId;
                    let checkPassword = await user.findOne({ emailId: email });
                    if (checkPassword) {
                        let mail = new Mail();
                        const userName = email.split('@');
                        const subject = "User Password";
                        const html = `<h3>Hello ${userName[0]}</h3>
                                <p> Successfully you are registered in Pustak Vari and</p>
                                <p>  this your password ${userPassword}  for login into Pustak Vari</p>
                                <br>
                                <p>Thanks,</p>
                                <p>Your Pushtak Vari team </p>`;
                        await mail.sendMail(email, html, subject);
                    }
                }
            }
            return { userDetail, uniqueEmail, uniqueMobileNo };
        } catch (error) {
            console.log(error);
            throw error;
        }

    }


    async userloginService(userBody) {
        try {
            const userInfo = await user.findOne({ emailId: userBody.emailId });
            if (userInfo) {
                if (userInfo.is_active == false) {
                    return { message: "Your account has been deleted." };
                }
                let data;
                switch (userInfo.userType) {
                    case 'SUPER_ADMIN':
                    case 'INSTITUTE_USER':
                    case 'INSTITUTE':
                    case 'REGULAR_USER':
                        data = await user.findOne({ emailId: userBody.emailId });
                        if (data.userType == 'INSTITUTE_USER') {
                            const instituteId = data.createdBy
                            var instituteInfo = await user.findOne({ _id: instituteId }, { instituteImage: 1 })
                        }
                        await verifyPassword(userBody.password, data.password);

                        break;
                    default:
                        return { message: "Invalid user access." };
                }
                if (userInfo.userType == 'SUPER_ADMIN') {
                    var token = await generateToken(
                        { email: userInfo.emailId, name: userInfo.fullName }, { expiresIn: '30h' }
                    )
                    const supperAdminSeesion = await session.findOne({ email: userInfo.emailId });
                    if (supperAdminSeesion) {
                        await user.findByIdAndUpdate({ _id: supperAdminSeesion.userId }, { loginStatus: false });
                        // Update existing session
                        await session.updateOne(
                            { email: userInfo.emailId },
                            { token }
                        );

                    } else {
                        // Create new session
                        await session.create({
                            email: userInfo.emailId,
                            token,
                            userId: userInfo._id,
                            userName: userInfo.fullName
                        });
                    }

                } else {
                    var token = await generateToken(
                        { email: userInfo.emailId, name: userInfo.fullName }, { expiresIn: '1h' }
                    )
                    const existingSession = await session.findOne({ email: userInfo.emailId });
                    if (existingSession) {
                        await user.findByIdAndUpdate({ _id: existingSession.userId }, { loginStatus: false });
                        // Update existing session
                        await session.updateOne(
                            { email: userInfo.emailId },
                            { token }
                        );

                    } else {
                        // Create new session
                        await session.create({
                            email: userInfo.emailId,
                            token,
                            userId: userInfo._id,
                            userName: userInfo.fullName
                        });
                    }
                }



                await user.findOneAndUpdate(
                    { emailId: userBody.emailId },
                    {
                        $set: {
                            loginStatus: true,
                            lastLoginDate: new Date()
                        }
                    },
                    { new: true }
                )
                if (instituteInfo) {
                    userInfo.instituteImage = instituteInfo.instituteImage
                }
                return {
                    token: token,
                    userInfo
                }
            }
            return { message: "Not Found" }

        } catch (error) {
            throw error
        }
    }

    async forgotPassordAndOTPService(body) {
        try {
            const email = body.emailId;
            let checkOtp = await user.findOne({ emailId: email });
            if (checkOtp.userType != 'SUPER_ADMIN') {
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
            }
            else {
                return { message: "Not sent OTP for SUPER_ADMIN." }
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
            let password
            if (checkOtp) {
                password = await getPasswordHash(body.password, 12);
                let userInfo = await user.updateOne({ _id: checkOtp._id }, { $set: { password: password } }, { new: true });
                return true;
            }
            if (instituteCheckOtp) {
                password = await getPasswordHash(body.password, 12);
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

    async userListService(status, instituteId) {
        try {
            let userList;
            let query = { "userType": { "$nin": ['INSTITUTE', 'SUPER_ADMIN'] } };

            let projection = {
                fullName: 1,
                emailId: 1,
                mobileNo: 1,
                password: 1,
                userType: 1,
                is_instituteUser: 1,
                userImage: 1,
                is_active: 1,
                created_at: 1,
                lastLoginDate: 1,
                select_Subscription: 1,
                subscriptionExpire: 1,
                is_subscribed: 1
            };

            if (instituteId) {
                query.createdBy = new mongoose.Types.ObjectId(instituteId),
                    query.is_instituteUser = true;
                query.userType = 'INSTITUTE_USER'
            }
            let sortOptions = { created_at: -1 };
            userList = await user.find(query, projection).sort(sortOptions);
            return userList;
        } catch (error) {
            throw error;
        }

    }

    async updateUserService(_id, dataBody, imageUrl, instituteUrl) {
        try {
            delete dataBody.email
            let userDetail = await user.findOne({ _id: _id });
            if (!userDetail) {
                return { message: "User not found" }
            }

            if (userDetail.userType == 'INSTITUTE') {
                if (dataBody.password) {
                    var updatepassword = await getPasswordHash(dataBody.password, 12);
                    dataBody.password = updatepassword
                }
                if (dataBody.select_Subscription) {
                    var subscriptionInfo = dataBody.select_Subscription ? await subscription.findOne({ _id: dataBody.select_Subscription }, { duration: 1, no_of_Users: 1, no_of_Books: 1 }) : null;
                    dataBody.select_Subscription = subscriptionInfo
                    dataBody.is_subscribed = subscriptionInfo ? true : false,
                        dataBody.no_of_user = subscriptionInfo ? subscriptionInfo.no_of_Users : 0,
                        dataBody.no_of_books = subscriptionInfo ? subscriptionInfo.no_of_Books : 0

                    subscriptionInfo.no_of_books
                    if (instituteUrl) {
                        dataBody.instituteImage = instituteUrl
                    }
                    var userInfo = await user.findOneAndUpdate(
                        { _id: _id },
                        dataBody,
                        { new: true }
                    )
                }
                else {
                    var userInfo = await user.findOneAndUpdate(
                        { _id: _id },
                        dataBody,
                        { new: true }
                    )
                }
                if (userInfo) {
                    const updateDate = userInfo.updated_at
                    let expiryDate
                    if (userInfo.select_Subscription.duration == 0) {
                        expiryDate = null
                    }
                    else {
                        const subscriptDate = new Date(updateDate)
                        const subscriptTime = Number(userInfo.select_Subscription.duration)

                        expiryDate = new Date(subscriptDate);
                        expiryDate.setFullYear(subscriptDate.getFullYear() + subscriptTime);
                    }
                    userInfo = await user.findOneAndUpdate(
                        { _id: _id },
                        {
                            $set: {
                                subscriptionExpire: expiryDate
                            }
                        },
                        { new: true }
                    )
                    const instituteID = _id
                    await user.updateMany(
                        { createdBy: instituteID },
                        {
                            $set: {
                                select_Subscription: userInfo.select_Subscription,
                                subscriptionExpire: userInfo.subscriptionExpire,
                                is_subscribed: true
                            }
                        },
                        { new: true }
                    )
                }
            }
            else {
                var id = userDetail._id
                if (imageUrl) {
                    dataBody.userImage = imageUrl
                }
                userInfo = await user.findOneAndUpdate(
                    { _id: id },
                    dataBody,
                    { new: true }
                );
            }

            return { userInfo }
        } catch (error) {
            console.log("error--------->", error)
            throw error;
        }
    }
    async getUserInfoService(_id) {
        try {
            let userDetail = await user.findOne({ _id: _id });
            if (!userDetail) {
                return { message: "User not exists." }
            }
            else {
                return userDetail
            }
        } catch (error) {
            throw error;
        }
    }
    async deleteUserService(_id) {
        try {
            let userInfo = await user.findOne({ _id: _id });
            if (userInfo) {
                var userdata = await user.findOneAndDelete({ _id });
                if (userdata.userType == 'INSTITUTE_USER') {
                    const instituteId = userdata.createdBy
                    await user.findOne(
                        { _id: instituteId },
                        {
                            $inc: { studentCount: -1 }
                        },
                        { new: true }
                    )
                }
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
            if (userInfo.userType == 'INSTITUTE') {
                var userdata = await user.findByIdAndUpdate(
                    _id, { is_active: active }, { new: true }
                );
                await user.updateMany(
                    { createdBy: _id, userType: 'INSTITUTE_USER' },
                    { is_active: active },
                    { new: true }
                )
            }
            if (userInfo.userType != 'SUPER_ADMIN') {
                userdata = await user.findByIdAndUpdate(
                    _id, { is_active: active }, { new: true }
                );
            }
            return { userInfo, userdata }
        } catch (error) {
            throw error;
        }
    }

    async logoutService(_id) {
        try {
            let userInfo = await user.findOne({ _id: _id });
            if (userInfo) {
                var userdata = await user.findByIdAndUpdate(
                    _id, { loginStatus: false }, { new: true }
                );
            }
            return { userInfo, userdata }
        } catch (error) {
            throw error;
        }
    }
    async socialMediaService(userBody, userPassword) {
        try {
            const mediaId = userBody.mediaId;
            const email = userBody.emailId;
            const mediaUser = await user.findOne({ mediaId: mediaId });
            const emailExist = await user.findOne({ emailId: email });

            let userInfo;
            let newUser;
            let token;

            if (mediaUser || emailExist) {
                console.log("User with the given mediaId or emailId already exists.");
                userInfo = mediaUser || emailExist;
                token = await generateToken({ email: userInfo.emailId, name: userInfo.fullName }, { expiresIn: '1h' });
                const existingSession = await session.findOne({ email: userInfo.emailId });
                if (existingSession) {
                    await user.findByIdAndUpdate({ _id: existingSession.userId }, { loginStatus: false });
                    // Update existing session
                    await session.updateOne(
                        { email: userInfo.emailId },
                        { token }
                    );

                } else {
                    // Create new session
                    await session.create({
                        email: userInfo.emailId,
                        token,
                        userId: userInfo._id,
                        userName: userInfo.fullName
                    });
                }
            } else {
                console.log("User can be created.");
                switch (userBody.userType) {
                    case 'INSTITUTE_USER':
                        newUser = {
                            fullName: userBody.fullName,
                            emailId: userBody.emailId,
                            mobileNo: userBody.mobileNo,
                            password: userBody.password,
                            userType: userBody.userType,
                            is_instituteUser: true,
                            is_active: true,
                            userImage: "",
                            createdBy: userBody.createdBy || '',
                            mediaId: userBody.mediaId,
                            mediaType: userBody.mediaType
                        };
                        break;
                    case 'REGULAR_USER':
                        newUser = {
                            fullName: userBody.fullName,
                            emailId: userBody.emailId,
                            mobileNo: userBody.mobileNo,
                            password: userBody.password,
                            userType: userBody.userType,
                            is_instituteUser: false,
                            is_active: true,
                            userImage: "",
                            mediaId: userBody.mediaId,
                            mediaType: userBody.mediaType
                        };
                        break;
                    default:
                        throw new Error("Invalid userType");
                }
                userInfo = await user.create(newUser);
                token = await generateToken({ email: userInfo.emailId, name: userInfo.fullName }, { expiresIn: '1h' });
                const existingSession = await session.findOne({ email: userInfo.emailId });
                if (existingSession) {
                    await user.findByIdAndUpdate({ _id: existingSession.userId }, { loginStatus: false });
                    // Update existing session
                    await session.updateOne(
                        { email: userInfo.emailId },
                        { token }
                    );

                } else {
                    // Create new session
                    await session.create({
                        email: userInfo.emailId,
                        token,
                        userId: userInfo._id,
                        userName: userInfo.fullName
                    });
                }
                await user.findOneAndUpdate(
                    { emailId: userInfo.emailId },
                    {
                        $set: {
                            loginStatus: true,
                            lastLoginDate: new Date()
                        }
                    },
                    { new: true }
                )
            }

            if (userPassword) {
                const email = userBody.emailId;
                let checkPassword = await user.findOne({ emailId: email });
                if (checkPassword) {
                    let mail = new Mail();
                    const userName = email.split('@');
                    const subject = "User Password";
                    const html = `<h3>Hello ${userName[0]}</h3>
                        <p> Successfully you are registered in Pustak Vari and</p>
                        <p>  this your password ${userPassword}  for login into Pustak Vari</p>
                        <br>
                        <p>Thanks,</p>
                        <p>Your Pushtak Vari team </p>`;
                    await mail.sendMail(email, html, subject);
                }
            }
            return { token: token, userInfo };
        } catch (error) {
            console.log("error=================>", error);
            throw error;
        }

    }
    async updateDeviceTokenService(fcmToken, userId) {
        try {
            const updateuserToken = await user.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        fcm_token: fcmToken
                    }
                },
                { new: true }
            )
            return updateuserToken
        } catch (error) {
            console.log("error=================>", error);
            throw error; s
        }
    }
    async updateUserLanguageService(language, userId) {
        try {
            const userExists = await user.findOne({ _id: userId })
            if (!userExists) {
                return { message: "User not exists." }
            }
            const updateUserLanguage = await user.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        language: language
                    }
                },
                { new: true }
            )
            return updateUserLanguage
        } catch (error) {
            console.log("error=================>", error);
            throw error; s
        }
    }
}

module.exports = AuthService;