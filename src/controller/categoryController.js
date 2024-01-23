const HttpStatus = require("http-status-codes");
const authService = require("../service/categoryService");
const categoryService = new authService();
class authController {
    async addCategoryController(req, res) {
        try {
            const file = req.file
            const data = req.body
            const categoryInfo = await categoryService.addCategoryService(data, file);
            return res.json({
                status: 201,
                message: "Category has been added successfully!",
                data: categoryInfo
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async categoryListController(req, res) {
        try {
            const categoryList = await categoryService.categoryListControllerService();

            return res.json({
                status: 200,
                message: "Category list get",
                data: categoryList
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