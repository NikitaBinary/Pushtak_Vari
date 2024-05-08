const user = require("../model/userModel")
const mongoose = require("mongoose")
const eBook = require("../model/ebookModel")
const moment = require("moment")

class AuthService {
    async getUserStatusService(instituteId) {
        try {
            const activeUserCount = await user.countDocuments({ is_active: true, userType: { "$nin": ['SUPER_ADMIN', 'INSTITUTE'] } });
            const inactiveUserCount = await user.countDocuments({ is_active: false, userType: { "$nin": ['SUPER_ADMIN', 'INSTITUTE'] } });

            const totalUser = await user.countDocuments({ userType: { "$nin": ['SUPER_ADMIN', 'INSTITUTE'] } });
            const totalInstitute = await user.find({ userType: "INSTITUTE" }).countDocuments()

            if (instituteId) {
                var instituteUserCount = await user.find({ createdBy: new mongoose.Types.ObjectId(instituteId), userType: "INSTITUTE_USER" }).countDocuments()
                var instituteActiveUserCount = await user.countDocuments({ is_active: true, userType: "INSTITUTE_USER", createdBy: new mongoose.Types.ObjectId(instituteId) })
                var instituteInactiveUserCount = await user.countDocuments({ is_active: false, userType: "INSTITUTE_USER", createdBy: new mongoose.Types.ObjectId(instituteId) })
                var subcriptionPlan = await user.findOne({ _id: instituteId }, { subscriptionExpire: 1, no_of_user: 1, no_of_books: 1 })
            }


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
            if (bookCount.length > 0) {
                const [eBook_Count] = bookCount
                var eBookCount = eBook_Count.eBookCount
            }
            else {
                eBookCount = 0
            }


            const aggregationPipeline = []

            aggregationPipeline.push(
                {
                    $match: {
                        // created_at: { $gte: thirtyDaysAgo, $lte: currentDate },
                        userType: { "$nin": ['SUPER_ADMIN', 'INSTITUTE'] }
                    }
                },
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
                },
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
                instituteUserCount,
                subcriptionPlan
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
