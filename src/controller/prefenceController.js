const authService = require("../service/prefenceService");
const prefenceService = new authService();

class authController {
    async myPrefenceController(req, res) {
        try {
            const prefenceOption = req.query.preferncesOption

            const userId = req.query.userId
            const genre = req.query.genre
            const author = req.query.author

            const prefenceList = await prefenceService.myPrefenceService(prefenceOption, genre, author, userId)

            return res.json({
                status: 200,
                message: "Get the list of prefernces",
                data: prefenceList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async updateMyPrefenceController(req, res) {
        try {
            const userId = req.params.id
            const type = req.query.type

            const response = await prefenceService.updateMyPrefenceService(userId, type)

            if(response.message){
                return res.json({
                    status:404,
                    message:response.message
                })
            }
            return res.json({
                status: 200,
                message: "Reset the prefernces successfully!",
                // data: response
            })


        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
}

module.exports = authController;