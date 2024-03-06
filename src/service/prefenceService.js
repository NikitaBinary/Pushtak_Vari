const mongoose = require("mongoose")
const ebook = require("../model/ebookModel")
const category = require("../model/categoryModel")
const user = require("../model/userModel")

class AuthService {
    async myPrefenceService(prefenceOption, genre, author, userId) {
        try {
            if (prefenceOption == "genre") {
                var genreList = await category.find({},
                    {
                        _id: 1,
                        categoryImage: 1,
                        categoryName: 1
                    })
            }
            if (prefenceOption == "author") {
                var authorList = await ebook.find({},
                    {
                        _id: 1,
                        authorName: 1
                    }
                )
            }
            if (genre) {
                await user.findOneAndUpdate(
                    { _id: userId },
                    {
                        $set: {
                            genre_prefernce: genre
                        }
                    },
                    {
                        new: true
                    }
                )
            }
            if (author) {
                await user.findOneAndUpdate(
                    { _id: userId },
                    {
                        $set: {
                            author_prefernce: author
                        }
                    },
                    {
                        new: true
                    }
                )
            }
            return { genreList, authorList }
        } catch (error) {
            throw error
        }
    }
}
module.exports = AuthService;