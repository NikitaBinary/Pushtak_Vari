const user = require("../model/userModel")
const eBook = require("../model/ebookModel")
const moment = require("moment")

class AuthService {
    async getUserStatusService() {
        try {
            const activeUserCount = await user.find({ is_active: true }, { userType: { "$nin": ['SUPER_ADMIN', 'INSTITUTE'] } }).countDocuments()
            const inactiveUserCount = await user.find({ is_active: false }, { userType: { "$nin": ['SUPER_ADMIN', 'INSTITUTE'] } }).countDocuments()
            const totalUser = await user.find({ "userType": { "$nin": ['SUPER_ADMIN', 'INSTITUTE'] } }).countDocuments();
            const totalInstitute = await user.find({ userType: "INSTITUTE" }).countDocuments()
            const instituteUserCount = await user.find({ userType: "INSTITUTE_USER" }).countDocuments()

            const instituteActiveUserCount = await user.find({ is_active: true, userType: "INSTITUTE_USER" }).countDocuments()
            const instituteInactiveUserCount = await user.find({ is_active: false, userType: "INSTITUTE_USER" }).countDocuments()

            const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
            const currentDate = new Date();

            const oneYearAgo = new Date(currentDate);
            oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

            let aggregatePipe = []
            aggregatePipe.push(
                {
                    $match: {
                        created_at: { $gte: thirtyDaysAgo, $lte: currentDate }
                    }
                },
                {
                    "$count": "eBookCount"
                }
            )
            const bookCount = await eBook.aggregate(aggregatePipe);
            const [eBook_Count] = bookCount
            const eBookCount = eBook_Count.eBookCount

            const aggregationPipeline = []

            aggregationPipeline.push(
                {
                    $project: {
                        month: { $month: "$created_at" }
                    }
                },
                {
                    $group: {
                        _id: "$month",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,

                        
                        month: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$_id", 1] }, then: "January" },
                                    { case: { $eq: ["$_id", 2] }, then: "February" },
                                    { case: { $eq: ["$_id", 3] }, then: "March" },
                                    { case: { $eq: ["$_id", 4] }, then: "April" },
                                    { case: { $eq: ["$_id", 5] }, then: "May" },
                                    { case: { $eq: ["$_id", 6] }, then: "June" },
                                    { case: { $eq: ["$_id", 7] }, then: "July" },
                                    { case: { $eq: ["$_id", 8] }, then: "August" },
                                    { case: { $eq: ["$_id", 9] }, then: "September" },
                                    { case: { $eq: ["$_id", 10] }, then: "October" },
                                    { case: { $eq: ["$_id", 11] }, then: "November" },
                                    { case: { $eq: ["$_id", 12] }, then: "December" }
                                ],
                                default: "Invalid Month"
                            }
                        },
                        count: 1
                    }
                },
                {
                    $sort: { month: 1 }
                }

            );
            const lastYearUserGraphData = await user.aggregate(aggregationPipeline);

            const aggregatePipePei = []

            aggregatePipePei.push(
                {
                    $group: {
                        _id: "$category.categoryName",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 5
                }
            )
            const peiChartData = await eBook.aggregate(aggregatePipePei);

            const superAdminData = {
                activeUserCount,
                inactiveUserCount,
                totalUser,
                totalInstitute,
                eBookCount,
                lastYearUserGraphData,
                peiChartData,
            }

            const instituteData = {
                instituteActiveUserCount,
                instituteInactiveUserCount,
                totalInstitute,
                eBookCount,
                instituteUserCount
            }

            return {
                superAdminData,
                instituteData
            }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AuthService;
