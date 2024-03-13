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
                const genreItem = await user.findByIdAndUpdate(
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
                const result1 = {
                    genre: genreItem.genre_prefernce
                }
                return result1
            }
            if (author) {
                const authorItem = await user.findOneAndUpdate(
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
                const result2 = {
                    author_prefernce: authorItem.author_prefernce
                }
                return result2
            }
            return { genreList, authorList }
        } catch (error) {
            console.log("error----------->", error)
            throw error
        }
    }

    async updateMyPrefenceService(userId) {
        try {
            if (userId) {
                const userInfo = await user.findOne({ _id: userId })
                if (!userInfo) {
                    return { message: "User not found!" }
                }
                var updatePreference = await user.updateOne(
                    {
                        _id: userId
                    },
                    {
                        $unset: {
                            genre_prefernce: "",
                            author_prefernce: ""
                        }
                    });
            }
            return updatePreference
        } catch (error) {
            throw error
        }
    }
}
module.exports = AuthService;