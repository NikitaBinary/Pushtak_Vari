const HttpStatus = require("http-status-codes");
const authService = require("../service/ebookService");
const { excelToJSON } = require("../helper/json")
const ebook = require("../model/ebookModel")
const test = require("../model/testModel")
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

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

    async bulkUpdateDevices(req, res) {
        try {
            // const convertExcelDate = (excelDate) => {

            //     if (excelDate < 1 || excelDate > 2958465) {
            //         console.error("Excel date is out of range.");
            //         return null; // or handle the error in an appropriate way
            //     }
            //     const msPerDay = 24 * 60 * 60 * 1000;
            //     const excelEpoch = Date.parse("1899-12-30");
            //     const excelTime = (excelDate - 1) * msPerDay;
            //     const date = new Date(excelTime + excelEpoch);
            //     const formattedDate = date.toISOString().split("T")[0];

            //     return formattedDate;
            // };
            const convertExcelDate = (excelDate) => {
                // Check if excelDate is undefined or null
                if (excelDate === undefined || excelDate === null) {
                    console.error("excelDate is undefined or null.");
                    return null; // or handle the error in an appropriate way
                }

                // Convert excelDate to a string
                const dateStr = excelDate.toString();

                // Assuming the date is in the format "DD/MM/YYYY"
                const parts = dateStr.split("/");
                const dateISO = `${parts[2]}-${parts[1]}-${parts[0]}`;

                const msPerDay = 24 * 60 * 60 * 1000;
                const excelEpoch = Date.parse("1899-12-30");
                const excelTime = (Date.parse(dateISO) - Date.parse("01/01/1970")) / msPerDay; // Adjusting for UNIX epoch
                const formattedDate = new Date(excelTime * msPerDay + excelEpoch).toISOString().split("T")[0];

                return formattedDate;
            };

            const xlsxDevicesUpdater = req.file
            const excelFilePath = xlsxDevicesUpdater.path;
            const wb = xlsx.readFile(excelFilePath);


            // Get data from the first sheet (assuming only one sheet)
            const sheetName = wb.SheetNames[0];
            const worksheet = wb.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

            for (let i = 1; i < data.length; i++) {
                const [
                    bookName,
                    bookImage,
                    authorName,
                    co_authorName,
                    publisher,
                    bookPublishDate,
                    category,
                    bookType,
                    price,
                    about,
                    bookPdf,
                    videoLink,
                    bookLanguage,
                ] = data[i];

                const webUrl = `${req.protocol}://${req.get('host')}`;

                //====================images-------------------------------------------------
                console.log("bookImage-------------------->", bookImage)
                if (bookImage && bookImage != undefined) {
                    var bookImagesArray = bookImage.split(',').map(image => image.trim());
                }
                const uploadedImages = [];
                for (const imageName of bookImagesArray) {
                    const imagePath = path.join('uploads', imageName);
                    let found = false;
                    const extensions = ['.jpg', '.jpeg', '.png'];
                    for (const ext of extensions) {
                        if (fs.existsSync(imagePath + ext)) {
                            console.log("comeem exixts");
                            var imageUrl = `${webUrl}/uploads/${imageName}${ext}`;
                            uploadedImages.push(imageUrl);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        console.error(`Image '${imageName}' does not exist in 'uploads' folder.`);
                    }
                }

                //---------------------pdf=============================================================
                console.log("bookPdf----------->", bookPdf)
                if (bookPdf !== undefined) {
                    var fileName = bookPdf.trim();
                }

                const filePath = path.join('uploads', fileName + '.pdf');

                if (fs.existsSync(filePath)) {
                    console.log("File exists");
                    var fileUrl = `${webUrl}/uploads/${fileName}.pdf`;
                    console.log("File URL:", fileUrl);

                    // res.status(200).send('File uploaded and saved successfully.');
                } else {
                    console.error(`PDF file '${fileName}' does not exist in 'uploads' folder.`);
                    // res.status(404).send('PDF file not found.');
                }

                const ebookTypeObject = { ebookType: bookType };
                const booklanguage = { language: bookLanguage }

                const correctPublishDate = convertExcelDate(bookPublishDate);

                // const parsedPrice = parseFloat(price.replace(/[^\d.]/g, ''));
                const parsedPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;


                var categoryArray = category.split(',').map(category => {
                    const [categoryName] = category.split(':');
                    return { categoryName };
                });




                if (videoLink && videoLink != undefined) {
                    var videoLinksArray = videoLink.split(',').map(link => link.replace(/^"(.*)"$/, '$1'));
                }

                const newBook = {
                    bookName,
                    bookImage: uploadedImages,
                    authorName,
                    co_authorName,
                    publisher,
                    bookPublishDate: correctPublishDate,
                    category: categoryArray,
                    bookType: ebookTypeObject,
                    price: isNaN(parsedPrice) ? 0 : parsedPrice,
                    about,
                    bookPdf: fileUrl,
                    videoLink: videoLinksArray,
                    bookLanguage: booklanguage,
                    is_selected: false,
                    userCount: 0
                };
                var exists_doc = await ebook.findOne({ bookName: newBook.bookName })
                if (exists_doc) {
                    var document = await ebook.updateMany(
                        { bookName: newBook.bookName },
                        newBook,
                        { new: true }
                    )
                }
                else {
                    var document = await ebook.insertMany(newBook);
                }
            }
            if (document) {
                return res.json({
                    status: 200,
                    message: "Data uploaded and saved to database successfully."
                })
            }
            else {
                return res.json({
                    status: 400,
                    message: "Data not uploaded."
                })
            }


        } catch (error) {
            console.error("Error:", error);
            return res.json({
                status: 500,
                message: error.message
            })
        }


    };

}



module.exports = authController;