const { default: mongoose } = require("mongoose");
const category = require("../model/categoryModel");
const eBook = require("../model/ebookModel")
const language = require("../model/ebookLanguageModel")

class AuthService {
    async addCategoryService(categoryBody) {
        try {
            const uniqueCategory = await category.findOne({ categoryName: categoryBody.categoryName })
            // const bookLanguage = await language.findById({ _id: categoryBody.language }, { _id: 1, language: 1 })
            // categoryBody.language = bookLanguage
            if (!uniqueCategory) {
                var categoryInfo = await category.create({
                    ...categoryBody,
                });
            }
            return { categoryInfo, uniqueCategory }
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

                const categoryOther = await category.findOne(
                    { categoryName: "Other Book" }
                )
                if (categoryOther) {
                    let id = categoryOther._id
                    let categoryName = categoryOther.categoryName

                    await eBook.updateMany(
                        { 'category._id': new mongoose.Types.ObjectId(_id) },
                        {
                            $set: {
                                "category._id": new mongoose.Types.ObjectId(id),
                                "category.categoryName": categoryName
                            }
                        },
                        { new: true }
                    );
                }
                return categorydata
            }
            return { message: "Category not found" }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService