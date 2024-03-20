const subscription = require("../model/subscriptionModel");
const subscriptionDuration = require("../model/subscriptionDurationModel")

class AuthService {

    async addSubscriptionDurationService(subscriptionData) {
        try {
            console.log("subscriptionData------------>", subscriptionData)
            const duration = await subscriptionDuration.create(subscriptionData)

            return duration
        } catch (error) {
            throw error;
        }
    }

    async subscriptionDurationListService() {
        try {
            const durationList = await subscriptionDuration.find()
            return durationList
        } catch (error) {
            throw error;
        }
    }

    async addSubscriptionService(subscriptionData) {
        try {
            const subscriptionDetail = await subscription.create(subscriptionData)
            return subscriptionDetail
        } catch (error) {
            throw error;
        }
    }

    async subscriptionListService() {
        try {
            const subscriptionList = await subscription.find()
            return subscriptionList
        } catch (error) {
            throw error;
        }
    }

    async updateSubscriptionService(_id, dataBody) {
        try {
            let subscriptionDetail = await subscription.findOne({ _id: _id });
            let subscriptionInfo = await subscription.findOneAndUpdate({ _id: _id }, dataBody, { new: true });
            return { subscriptionDetail, subscriptionInfo }
        } catch (error) {
            throw error;
        }
    }

    async getSubscriptionInfoService(_id) {
        try {
            let subscriptionDetail = await subscription.findOne({ _id: _id });
            if (subscriptionDetail) {
                var subscriptionInfo = await subscription.findOne({ _id: _id }, {});
            }
            return { subscriptionDetail, subscriptionInfo }
        } catch (error) {
            throw error;
        }
    }

    async deleteSubscriptionService(_id) {
        try {
            let subscriptionInfo = await subscription.findOne({ _id: _id });

            if (subscriptionInfo) {
                var subscriptiondata = await subscription.findOneAndDelete({ _id });
                return subscriptiondata
            }
            return { message: "Subscription not found" }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService