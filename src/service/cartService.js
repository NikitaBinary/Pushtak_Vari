const mongoose = require("mongoose")
const cart = require("../model/cartModel");



class AuthService {
    async addBookToCartService(cartBody) {
        try {
            const cartDetail = await cart.create(cartBody)
            return cartDetail
        } catch (error) {
            throw error
        }
    }

    async cartBookListService(userId) {
        try {
            if (userId) {
                const cartList = await cart.find({ userId: userId }, {})
                return cartList
            }

        } catch (error) {
            throw error
        }
    }

    async deleteCartBookService(_id) {
        try {
            let cartbookInfo = await cart.findOne({ _id: _id });
            if (cartbookInfo) {
                var cartBookData = await cart.findOneAndDelete({ _id });
                return cartBookData
            }
            return { message: "Cart book not found" }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService;