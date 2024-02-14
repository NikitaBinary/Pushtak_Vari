const HttpStatus = require("http-status-codes");
const authService = require("../service/categoryService");
const categoryService = new authService();
class authController {
    async addCategoryController(req, res) {
        try {
            const file = req.file
            const data = req.body

            if(file){
                const webUrl = `${req.protocol}://${req.get('host')}`;
                var ImageUrl = `${webUrl}/uploads/${file.filename}`
            }
            
            const categoryInfo = await categoryService.addCategoryService(data, ImageUrl);
           
            if(categoryInfo.uniqueCategory){
                return res.json({
                    status: 400,
                    message: "Category name already exists.",
                })
            }
            return res.json({
                status: 201,
                message: "Category has been added successfully!",
                data: categoryInfo.categoryInfo
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

    async categoryUpdateController(req, res) {
        try {
            let dataBody = req.body
            const file = req.file
            const id = req.params.id

            if (file) {
                const webUrl = `${req.protocol}://${req.get('host')}`;
                var ImageUrl = `${webUrl}/uploads/${file.filename}`
            }

            const categoryInfo = await categoryService.updateCategoryService(id, dataBody, ImageUrl);
            if (!categoryInfo.categoryDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "Category not exists.",
                });
            }
            delete categoryInfo.categoryDetail
            return res.status(200).send({
                status: 200,
                message: "Category has been updated successfully!",
                body: categoryInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async deleteCategoryController(req, res) {
        try {
            let id = req.params.id
            const response = await categoryService.deleteCategoryService(id);

            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Category information deleted.",
                data: response
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }


}

module.exports = authController;