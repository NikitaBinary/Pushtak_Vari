const category = require("../model/categoryModel");

class AuthService {
    async addCategoryService(categoryBody, file) {
        try {
            console.log("file--------->", file)
            var categoryInfo = await category.create({
                ...categoryBody,
                categoryImage: file,
            });
            return categoryInfo

        } catch (error) {
            throw error;
        }
    }
    async categoryListControllerService() {
        try {
            const categoryList = await category.find()
            return categoryList
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService