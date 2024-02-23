const { default: mongoose } = require("mongoose");
const category = require("../model/categoryModel");
const eBook = require("../model/ebookModel")

class AuthService {
    async addCategoryService(categoryBody, ImageUrl) {
        try {
            const uniqueCategory = await category.findOne({ categoryName: categoryBody.categoryName })
            if (!uniqueCategory) {
                var categoryInfo = await category.create({
                    ...categoryBody,
                    categoryImage: ImageUrl || '',
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



                // let id = new mongoose.Types.ObjectId('65d6e954f4b1475fef683f63')
                // let categoryName = "Other Book"

                // console.log("yaaa")
                // const data = await eBook.findOne( 
                //     { 'category._id': _id }
                // {
                //     $set: {
                //         "category._id": id,
                //         // "category.categoryName": categoryName
                //     }
                // },
                // { new: true }
                // );

                // console.log("data--------->",data)


                return categorydata
            }
            return { message: "Category not found" }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService