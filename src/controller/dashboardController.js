const authService = require("../service/dashboardService");
const dashService = new authService();

class authController {
    async getUserStatusController(req, res) {
        try {
            const instituteId = req.query.instituteId
            const userList = await dashService.getUserStatusService(instituteId);
            
            return res.json({
                status: 200,
                message: "User Status list get",
                data: userList
            })

        } catch (error) {
            console.log("erorro---------->",error)
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
}

module.exports = authController;