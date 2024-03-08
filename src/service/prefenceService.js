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
                const genreItem = await user.findOneAndUpdate(
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
            throw error
        }
    }

    async updateMyPrefenceService(userId, genre, author) {
        try {
            let updatePrefrence
            if (genre) {
                updatePrefrence = await user.findOneAndUpdate(
                    { _id: userId },
                    { genre_prefernce: genre }
                )
            }

            if (author) {
                updatePrefrence = await user.findOneAndUpdate(
                    { _id: userId },
                    { author_prefernce: author }
                )
            }

            return updatePrefrence
        } catch (error) {
            throw error
        }

    }
}
module.exports = AuthService;