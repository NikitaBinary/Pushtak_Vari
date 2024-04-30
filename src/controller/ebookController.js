const HttpStatus = require("http-status-codes");
const authService = require("../service/ebookService");
const { excelToJSON } = require("../helper/json")
const ebook = require("../model/ebookModel")
const ebookService = new authService();

class authController {
    async addEbookTypeController(req, res) {
        try {
            const ebookTypeInfo = await ebookService.addEbookTypeService(req.body);
            return res.json({
                status: 201,
                message: "E-Book type has been added successfully!",
                data: ebookTypeInfo
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async ebookTypeListController(req, res) {
        try {
            const ebookTypeList = await ebookService.ebookTypeListService();

            return res.json({
                status: 200,
                message: "ebookType list get",
                data: ebookTypeList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async ebooklanguageListController(req, res) {
        try {
            const ebooklanguageList = await ebookService.ebooklanguageListService();

            return res.json({
                status: 200,
                message: "E-Book language list get",
                data: ebooklanguageList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async createEbookController(req, res) {
        try {
            const pdfFile = req.files.bookPdf
            const imageFile = req.files.bookImages
            const data = req.body

            const webUrl = `${req.protocol}://${req.get('host')}`;

            if (imageFile) {
                var imageUrl = imageFile.map(file => `${webUrl}/uploads/${file.filename}`).join(', ')
            }
            if (pdfFile) {
                const [pdf_file] = pdfFile
                var pdfUrl = `${webUrl}/uploads/${pdf_file.filename}`
            }
            const ebookDetail = await ebookService.createEbookService(data, imageUrl, pdfUrl);
            return res.json({
                status: 201,
                message: "E-Book has been added successfully!",
                data: ebookDetail
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async updateEbookController(req, res) {
        try {
            const dataBody = req.body
            const id = req.params.id

            const pdfFile = req.files.bookPdf
            const imageFile = req.files.bookImages
            const webUrl = `${req.protocol}://${req.get('host')}`;

            if (pdfFile) {
                const [pdf_file] = pdfFile
                var pdfUrl = `${webUrl}/uploads/${pdf_file.filename}`
            }

            if (imageFile) {
                var imageUrl = imageFile.map(file => `${webUrl}/uploads/${file.filename}`).join(', ')
            }

            const eBookInfo = await ebookService.updateEbookService(id, dataBody, imageUrl, pdfUrl);
            if (!eBookInfo.eBookDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "E-Book not exists",
                });
            }
            delete eBookInfo.eBookDetail
            return res.status(200).send({
                status: 200,
                message: "E-Book has been updated successfully!",
                body: eBookInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }
    async deleteEbookController(req, res) {
        try {
            let id = req.params.id
            const response = await ebookService.deleteEbookService(id);

            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                });
            }
            return res.status(200).send({
                status: 200,
                message: "E-Book information deleted.",
                data: response
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async getEbookListController(req, res) {
        try {
            const eBookList = await ebookService.getEbookListService();

            return res.json({
                status: 200,
                message: "E-Book list get.",
                data: eBookList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async getEbookInfoController(req, res) {
        try {
            const id = req.params.id
            const response = await ebookService.getEbookInfoService(id);
            if (!response.eBookDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "E-Book id not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "E-Book Detail get",
                body: response.eBookInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async getAppEbookListController(req, res) {
        try {
            // const language = req.query.language
            const category = req.query.type
            const userId = req.query.userId

            const eBookList = await ebookService.getAppEbookListService(category, userId);

            return res.json({
                status: 200,
                message: "E-Book list get.",
                data: eBookList
            })

        } catch (error) {
            console.log("errorr----------->", error)
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async addReviewController(req, res) {
        try {
            const reviewInfo = await ebookService.addReviewService(req.body);
            if (reviewInfo.message) {
                return res.json({
                    status: 404,
                    message: reviewInfo.message
                })
            }
            return res.json({
                status: 201,
                message: "E-Book review has been added successfully!",
                data: reviewInfo
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async eBookInfoController(req, res) {
        try {
            const id = req.params.id
            const response = await ebookService.eBookInfoService(id);
            if (!response.eBookDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "E-Book id not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "E-Book Detail get",
                body: response.eBookInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async exploreBookListController(req, res) {
        try {

            const userId = req.query.userId
            const searchText = req.query.searchText || ""
            const eBookList = await ebookService.exploreBookListService(userId, searchText);
            if (eBookList.message) {
                return res.json({
                    status: 404,
                    message: eBookList.message
                })
            }
            return res.json({
                status: 200,
                message: "E-Book list get.",
                data: eBookList
            })

        } catch (error) {
            console.log("errorr----------->", error)
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async languageListController(req, res) {
        try {
            const languageList = await ebookService.languageListService();

            return res.json({
                status: 200,
                message: "Language list get.",
                data: languageList
            })

        } catch (error) {
            console.log("errorr----------->", error)
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async addPdfCommentController(req, res) {
        try {
            const data = req.body
            const pdfText = await ebookService.addPdfCommentService(data);
            return res.json({
                status: 200,
                message: "Add Pdf points.",
                data: pdfText
            })

        } catch (error) {
            console.log("errorr----------->", error)
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async getPdfCommentController(req, res) {
        try {
            const userId = req.query.userId
            const bookId = req.query.bookId
            const pdfHighlighterList = await ebookService.getPdfCommentService(userId, bookId);

            if (pdfHighlighterList.message) {
                return res.json({
                    status: 400,
                    message: pdfHighlighterList.message
                })
            }

            return res.json({
                status: 200,
                message: "Pdf comments list get.",
                data: pdfHighlighterList
            })

        } catch (error) {
            console.log("errorr----------->", error)
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    // async bulkUpdateDevices(req, res) {
    //     try {
    //         const xlsxDevicesUpdater = req.file;
    //         console.log("xlsxDevicesUpdater-------------->", req.file)

    //         if (!xlsxDevicesUpdater)
    //             return res.status(400).send({
    //                 status: 400,
    //                 error:
    //                     'devices updater xlsx file is required on xlsx_devices_updater form field.',
    //             });

    //         const excelParsedList = (
    //             await excelToJSON(xlsxDevicesUpdater.filename, 'buffer')
    //         )[0];

    //         if (
    //             !Array.isArray(excelParsedList) ||
    //             !excelParsedList ||
    //             (Array.isArray(excelParsedList) && excelParsedList.length === 0)
    //         ) {
    //             throw new Error("There's nothing in sheet to update.");
    //         }

    //         if (
    //             excelParsedList.length === 1 &&
    //             Object.keys(excelParsedList[0]).length === 0
    //         ) {
    //             throw new Error("There's nothing in sheet to update.");
    //         }

    //         const acceptedDeviceList = [];
    //         const rejectedDeviceList = [];

    //         const promises = [];

    //         for (let i = 0; i < excelParsedList.length; i++) {
    //             const currentEBookObj = excelParsedList[i];

    //             Object.entries(currentEBookObj).forEach(([key, value]) => {
    //                 if (
    //                     (value !== 0 && !value) ||
    //                     (value && `${value}`.trim().length === 0)
    //                 )
    //                     delete currentEBookObj[key];
    //                 if (typeof value === 'string') currentEBookObj[key] = value.trim();
    //             });

    //             let {
    //                 device_serial,
    //                 bookName,
    //                 // is_device_active,
    //                 authorName,
    //                 co_authorName,
    //                 publisher,
    //                 bookPdf,
    //                 price,
    //                 bookImage,
    //             } = currentEBookObj;[]
    //             let { bookName: _, ...restCurrentEBookObj } = currentEBookObj;

    //             // console.log("restCurrentEBookObj-------------->",)
    //             const rejection = { reason: '', row: i + 2, bookName };

    //             console.log('rejection-------------->', rejection);

    //             if (Object.keys(currentEBookObj).length === 0) {
    //                 rejection.reason = `empty row`;
    //                 rejectedDeviceList.push(rejection);
    //                 continue;
    //             }

    //             if (Object.keys(restCurrentEBookObj).length === 0) {
    //                 rejection.reason = `min 1 field value required to update device details`;
    //                 rejectedDeviceList.push(rejection);
    //                 continue;
    //             }

    //             const updateObj = {};

    //             if (!bookName || (bookName && bookName.length < 8)) {
    //                 rejection.reason = 'Book name is invalid';
    //                 rejectedDeviceList.push(rejection);
    //                 continue;
    //             }

    //             if (authorName) {
    //                 if (`${authorName}`.length < 3) {
    //                     rejection.reason = `authorName = ${authorName} must be min 5 characters long`;
    //                     rejectedDeviceList.push(rejection);
    //                     continue;
    //                 }
    //                 updateObj.authorName = authorName;
    //             }
    //             if (bookPdf) {
    //                 if (`${bookPdf}`.length < 3) {
    //                     rejection.reason = `bookPdf = ${bookPdf} must be min 5 characters long`;
    //                     rejectedDeviceList.push(rejection);
    //                     continue;
    //                 }
    //                 updateObj.bookPdf = bookPdf;
    //             }
    //             if (co_authorName) {
    //                 if (`${co_authorName}`.length < 3) {
    //                     rejection.reason = `co_authorName = ${co_authorName} must be min 3 characters long`;
    //                     rejectedDeviceList.push(rejection);
    //                     continue;
    //                 }
    //                 updateObj.co_authorName = co_authorName;
    //             }
    //             if (publisher) {
    //                 if (`${publisher}`.length < 3) {
    //                     rejection.reason = `publisher = ${publisher} must be min 3 characters long`;
    //                     rejectedDeviceList.push(rejection);
    //                     continue;
    //                 }
    //                 updateObj.publisher = publisher;
    //             }

    //             if (price) {
    //                 if (`${price}`.length < 7) {
    //                     rejection.reason = `price must be min 7 characters long`;
    //                     rejectedDeviceList.push(rejection);
    //                     continue;
    //                 }
    //                 updateObj.price = price;
    //             }
    //             if (bookImage) {
    //                 if (`${bookImage}`.length < 1) {
    //                     rejection.reason = `bookImage must be min 1 characters long`;
    //                     rejectedDeviceList.push(rejection);
    //                     continue;
    //                 }
    //                 updateObj.bookImage = bookImage;
    //             }
    //             if (bookName) {
    //                 if (`${bookName}`.length < 3) {
    //                     rejection.reason = `bookName must be min 7 characters long`;
    //                     rejectedDeviceList.push(rejection);
    //                     continue;
    //                 }
    //                 updateObj.bookName = bookName;
    //             }
    //             // if (is_device_active >= 0) {
    //             //     if (typeof is_device_active !== 'number') {
    //             //         rejection.reason = `is_device_active must be in boolean`;
    //             //         rejectedDeviceList.push(rejection);
    //             //         continue;
    //             //     }
    //             //     if (is_device_active === 0) {

    //             //         updateObj.is_device_active = false
    //             //     }
    //             //     if (is_device_active === 1) {
    //             //         updateObj.is_device_active = true
    //             //     }
    //             // }
    //             console.log("updateObj---------------->", updateObj)
    //             promises.push(
    //                 new Promise(async (resolve, reject) => {
    //                     try {
    //                         const doc = await ebook.findOneAndUpdate(
    //                             { bookName: bookName },
    //                             { $set: updateObj }
    //                         ).lean();
    //                         // if (!doc) throw new Error('BookName not found in database');
    //                         if (!doc) {
    //                             const newDoc = await ebook.create(updateObj)
    //                         }
    //                         // console.dir({doc, device_serial}, {depth: 100})
    //                         acceptedDeviceList.push({
    //                             device_serial,
    //                             updated_fields: Object.keys(updateObj),
    //                         });
    //                         resolve(doc);
    //                     } catch (error) {
    //                         // console.dir({device_serial, error})
    //                         rejection.reason = error.message;
    //                         rejectedDeviceList.push(rejection);
    //                         return reject(error);
    //                     }
    //                 })
    //             );
    //         }

    //         await Promise.allSettled(promises);

    //         const totalCounts = excelParsedList.length;
    //         const acceptedCounts = acceptedDeviceList.length;
    //         const rejectedCounts = rejectedDeviceList.length;

    //         res.send({
    //             status: 200,
    //             data: {
    //                 totalCounts,
    //                 acceptedCounts,
    //                 rejectedCounts,
    //                 acceptedDeviceList,
    //                 rejectedDeviceList,
    //             },
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.send({ error: error.message, status: 500 });
    //     }
    // };
}



module.exports = authController;