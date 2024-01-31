const category = require("../model/categoryModel");

class AuthService {
    async addCategoryService(categoryBody, ImageUrl) {
        try {

            var categoryInfo = await category.create({
                ...categoryBody,
                categoryImage: ImageUrl,
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

    async updateCategoryService(_id, dataBody, ImageUrl) {
        try {
            if (ImageUrl) {
                dataBody.categoryImage = ImageUrl
            }
            let categoryDetail = await category.findOne({ _id: _id });
            let categoryInfo = await category.findOneAndUpdate({ _id: _id }, dataBody, { new: true });
            return { categoryDetail, categoryInfo }
        } catch (error) {
            throw error;
        }
    }

    async deleteCategoryService(_id) {
        try {
            let categoryInfo = await category.findOne({ _id: _id });
            if (categoryInfo) {
                var categorydata = await category.findOneAndDelete({ _id });
                return categorydata
            }
            return { message: "Category not found" }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService