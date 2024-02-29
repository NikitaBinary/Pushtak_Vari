const authService = require("../service/cartService");
const cartService = new authService();

class authController {
    async addBookToCartController(req, res) {
        try {
            const bookCartInfo = await cartService.addBookToCartService(req.body);
            return res.json({
                status: 201,
                message: "Book has been added successfully in cart!",
                data: bookCartInfo
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async cartBookListController(req, res) {
        try {
            const userId = req.query.userId
            const cartBookList = await cartService.cartBookListService(userId);

            return res.json({
                status: 200,
                message: "Cart book list list get",
                data: cartBookList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async deleteCartBookController(req, res) {
        try {
            let id = req.params.id
            const response = await cartService.deleteCartBookService(id);

            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Book from cart deleted.",
                data: response
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    // async updateCartBuyBook(req, res) {
    //     try {
    //         let bookId = req.params.bookId
    //         let userId = req.params.userId
    //         const updateData = req.body
    //         const response = await cartService.updateCartBuyBookService(updateData, userId, bookId);

    //         return res.status(200).send({
    //             status: 200,
    //             message: "Book purchase successfully.",
    //             data: response
    //         })

    //     } catch (error) {
    //         return res.status(500).send({
    //             status: 500,
    //             message: error.message,
    //         });
    //     }
    // }
}

module.exports = authController;