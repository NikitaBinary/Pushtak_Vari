const mongoose = require("mongoose")
const ebookType = require("../model/ebookTypeModel");
const eBook = require("../model/ebookModel")
const category = require("../model/categoryModel")
const language = require("../model/ebookLanguageModel")
const review = require("../model/reviewModel");
const user = require("../model/userModel");
const instituteBook = require("../model/instituteAssignBook");
const purchase = require("../model/bookPurchaseModel")
const pdf_Highlighter = require("../model/addPdfHighLighter")


class AuthService {
    async addEbookTypeService(ebookBody) {
        try {
            const ebookTypeInfo = await ebookType.create(ebookBody);
            return ebookTypeInfo

        } catch (error) {
            throw error;
        }
    }
    async ebookTypeListService() {
        try {
            const ebookTypeList = await ebookType.find()
            return ebookTypeList
        } catch (error) {
            throw error;
        }
    }
    async ebooklanguageListService() {
        try {
            const ebooklanguageList = await language.find()
            return ebooklanguageList
        } catch (error) {
            throw error;
        }
    }

    async createEbookService(ebookData, imageUrl, pdfUrl) {
        try {
            const categoryIds = ebookData.category
            const categoryData = await category.find({ _id: { $in: categoryIds } }, { _id: 1, categoryName: 1 })
            const bookType = await ebookType.findById({ _id: ebookData.bookType }, { _id: 1, ebookType: 1 })
            const bookLanguage = await language.findById({ _id: ebookData.bookLanguage }, { _id: 1, language: 1 })

            if (imageUrl) {
                var imageUrlArray = imageUrl.split(", ").map(url => url.trim());
            }

            ebookData.category = categoryData
            ebookData.bookType = bookType
            ebookData.bookLanguage = bookLanguage

            const eBookDetail = await eBook.create({
                ...ebookData,
                bookImage: imageUrlArray,
                bookPdf: pdfUrl
            });
            return eBookDetail

        } catch (error) {
            console.log("error---------------->", error)
            throw error;
        }
    }

    async updateEbookService(_id, dataBody, ImageUrl, pdfUrl) {
        try {
            if (ImageUrl) {
                const imageUrlArray = ImageUrl.split(", ").map(url => url.trim());
                dataBody.bookImage = imageUrlArray;
            }
            if (pdfUrl) {
                dataBody.bookPdf = pdfUrl
            }
            if (dataBody.category) {
                const categoryIds = dataBody.category
                const categoryData = await category.find({ _id: { $in: categoryIds } }, { _id: 1, categoryName: 1 })
                dataBody.category = categoryData;
            }
            if (dataBody.bookType) {
                const bookType = dataBody.bookType ? await ebookType.findById(dataBody.bookType, { _id: 1, ebookType: 1 }) : null;
                dataBody.bookType = bookType;
            }
            if (dataBody.bookLanguage) {
                const bookLanguage = dataBody.bookLanguage ? await language.findById(dataBody.bookLanguage, { _id: 1, language: 1 }) : null;
                dataBody.bookLanguage = bookLanguage;
            }
            let eBookDetail = await eBook.findOne({ _id: _id });
            let eBookInfo = await eBook.findOneAndUpdate({ _id: _id }, dataBody, { new: true });
            return { eBookDetail, eBookInfo };
        } catch (error) {

            throw error;
        }

    }
    async deleteEbookService(_id) {
        try {
            let eBookInfo = await eBook.findOne({ _id: _id });
            if (eBookInfo) {
                var eBookdata = await eBook.findOneAndDelete({ _id });
                return eBookdata
            }
            return { message: "E-Book not found" }
        } catch (error) {
            throw error;
        }
    }
    async getEbookListService() {
        try {
            const eBookList = await eBook.find().collation({ locale: 'hi' }).sort({ bookName: 1 })
            return eBookList
        } catch (error) {
            throw error;
        }
    }
    async getEbookInfoService(_id) {
        try {
            let eBookDetail = await eBook.findOne({ _id: _id });
            if (eBookDetail) {
                var eBookInfo = await eBook.findOne({ _id: _id }, {});
            }
            return { eBookDetail, eBookInfo }
        } catch (error) {
            throw error;
        }
    }
    async getAppEbookListService(category, userId) {
        try {
            function calculateRatingStats(reviews) {
                if (reviews.length === 0) return { ratingStats: [], overallRating: 0 };

                let totalRating = 0;
                const ratingCounts = Array(5).fill(0);

                reviews.forEach(review => {
                    totalRating += review.rating;
                    ratingCounts[review.rating - 1]++;
                });

                const totalReviews = reviews.length;
                const ratingStats = ratingCounts.map((count, index) => ({
                    rating: index + 1,
                    count,
                    percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0
                }));

                const overallRating = totalReviews > 0 ? (totalRating / totalReviews) * 20 : 0;

                return { ratingStats, overallRating };
            }
            const id = new mongoose.Types.ObjectId(userId)
            const userInfo = await user.findOne({ _id: id })

            let trendingBookQuery = [];
            let newAggregatePipe = [];
            let otherAggregatePipe = [];
            var booklist
            if (userInfo.userType == "INSTITUTE_USER") {
                let condition = {}
                const instituteId = userInfo.createdBy
                const assignBook = await instituteBook.findOne({ instituteID: new mongoose.Types.ObjectId(instituteId) })
                if (!assignBook) {

                    return { message: "This institute not assign any book." }
                }
                booklist = assignBook.BookList

                if (userInfo.genre_prefernce.length > 0) {
                    var genreCategory = userInfo.genre_prefernce
                    condition['category.categoryName'] = { $in: genreCategory };
                }
                if (userInfo.author_prefernce.length > 0) {
                    var authorCategory = userInfo.author_prefernce
                    condition.authorName = { $in: authorCategory };
                }
                //--------------trending book -------------------------------------------

                if (typeof condition === 'object' && Object.keys(condition).length > 0) {
                    trendingBookQuery.push(
                        {
                            $match: condition
                        }
                    );
                }
                if (category) {
                    trendingBookQuery.push(
                        {
                            $match: {
                                _id: { $in: booklist },
                            }
                        }
                    )
                    trendingBookQuery.push(
                        {
                            $match: {
                                'category.categoryName': category
                            }
                        }
                    )
                    trendingBookQuery.push(
                        {
                            $sort: { userCount: -1 }
                        },
                        {
                            $lookup: {
                                from: 'review_lists',
                                localField: '_id',
                                foreignField: 'bookId',
                                as: "reviewData"
                            }
                        },
                        // {
                        //     $sort: { created_at: -1 }
                        // },
                        {
                            $limit: 5
                        }
                    );
                    var treandingBookList = await eBook.aggregate(trendingBookQuery);
                    if (treandingBookList.length === 0) {
                        treandingBookList = []
                    }
                }

                if (!category) {
                    if (authorCategory) {
                        var authorQuery = [
                            {
                                $match: {
                                    authorName: { $in: authorCategory }
                                }
                                // condition
                            },
                            {
                                $match: {
                                    userCount: { $exists: true },
                                    _id: { $in: booklist }
                                }
                            },
                            {
                                $sort: { userCount: -1 }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            // {
                            //     $sort: { created_at: -1 }
                            // },
                            {
                                $limit: 5
                            }
                        ];
                        var AuthorResponse = await eBook.aggregate(authorQuery);
                    }
                    if (genreCategory) {
                        let categoryQuery = [
                            {
                                $match: {
                                    'category.categoryName': { $in: genreCategory },
                                }
                                // condition
                            },
                            {
                                $match: {
                                    userCount: { $exists: true },
                                    _id: { $in: booklist }
                                }
                            },
                            {
                                $sort: { userCount: -1 }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            // {
                            //     $sort: { created_at: -1 }
                            // },
                            {
                                $limit: 5
                            }
                        ];
                        var categoryResponse = await eBook.aggregate(categoryQuery);
                    }
                    if (AuthorResponse && categoryResponse) {
                        const mergedResults = [...AuthorResponse, ...categoryResponse];
                        treandingBookList = Array.from(new Set(mergedResults.map(result => result._id)))
                            .map(_id => mergedResults.find(result => result._id === _id));
                        // treandingBookList = await eBook.aggregate(trendingBookQuery);
                    }
                    else {
                        if (AuthorResponse) {
                            treandingBookList = AuthorResponse
                        }
                        if (categoryResponse) {
                            treandingBookList = categoryResponse
                        }
                    }
                    if (!authorCategory && !genreCategory) {
                        trendingBookQuery = [
                            {
                                $match: {
                                    userCount: { $exists: true },
                                    _id: { $in: booklist }
                                }
                            },
                            {
                                $sort: { userCount: -1 }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            // {
                            //     $sort: { created_at: -1 }
                            // },
                            {
                                $limit: 5
                            }
                        ]
                        treandingBookList = await eBook.aggregate(trendingBookQuery);
                    }
                }
                treandingBookList.forEach(book => {
                    const reviews = book.reviewData;
                    const { ratingStats, overallRating } = calculateRatingStats(reviews);
                    book.ratings = ratingStats;
                    book.overallRating = Math.round(overallRating);
                    book.reviewUserCount = book.reviewData.length
                    book.reviewData = reviews
                });
                //-----------------------newadded book---------------------------------------

                if (typeof condition === 'object' && Object.keys(condition).length > 0) {
                    newAggregatePipe.push(
                        {
                            $match: condition
                        }
                    );
                }
                if (category) {
                    newAggregatePipe.push(
                        {
                            $match: {
                                _id: { $in: booklist },
                                'category.categoryName': category
                            }
                        },

                        {
                            $lookup: {
                                from: 'review_lists',
                                localField: '_id',
                                foreignField: 'bookId',
                                as: "reviewData"
                            }
                        },
                        {
                            $sort: { created_at: -1 }
                        }
                    );
                    var newlyAddedBookList = await eBook.aggregate(newAggregatePipe);
                    if (newlyAddedBookList.length === 0) {
                        newlyAddedBookList = []
                    }
                }

                if (!category) {
                    if (!authorCategory && !genreCategory) {
                        newAggregatePipe = [
                            {
                                $match: { _id: { $in: booklist } }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            {
                                $sort: { created_at: -1 }
                            }
                        ];
                        newlyAddedBookList = await eBook.aggregate(newAggregatePipe);
                    }

                    if (authorCategory) {
                        var authorQuery = [
                            {
                                $match: {
                                    authorName: { $in: authorCategory }
                                }
                            },
                            {
                                $match: { _id: { $in: booklist } }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            {
                                $sort: { created_at: -1 }
                            }
                        ]
                        var authorData = await eBook.aggregate(authorQuery);
                    }
                    if (genreCategory) {
                        let categoryQuery = [
                            {
                                $match: {
                                    'category.categoryName': { $in: genreCategory },
                                }
                            },
                            {
                                $match: { _id: { $in: booklist } }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            {
                                $sort: { created_at: -1 }
                            }
                        ]
                        var categoryData = await eBook.aggregate(categoryQuery);
                    }
                    if (authorData && categoryData) {
                        const mergedResults = [...authorData, ...categoryData];
                        newlyAddedBookList = Array.from(new Set(mergedResults.map(result => result._id)))
                            .map(_id => mergedResults.find(result => result._id === _id));
                    }
                    else {
                        if (authorData) {
                            newlyAddedBookList = authorData
                        }
                        if (categoryData) {
                            newlyAddedBookList = categoryData
                        }
                    }
                }
                newlyAddedBookList.forEach(book => {
                    const reviews = book.reviewData;
                    const { ratingStats, overallRating } = calculateRatingStats(reviews);
                    book.ratings = ratingStats;
                    book.overallRating = Math.round(overallRating);
                    book.reviewUserCount = book.reviewData.length
                    book.reviewData = reviews
                });
                //-----------------------otherBook-------------------------------------------
                if (authorCategory) {
                    otherAggregatePipe.push(
                        {
                            $match: {
                                authorName: { $in: authorCategory }
                            }
                        },
                    )
                }
                otherAggregatePipe.push(
                    {
                        $match: {
                            'category.categoryName': "Others",
                            _id: { $in: booklist }
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
                otherAggregatePipe.push(
                    {
                        $lookup: {
                            from: 'review_lists',
                            localField: '_id',
                            foreignField: 'bookId',
                            as: "reviewData"
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
                var otherBookList = await eBook.aggregate(otherAggregatePipe)

                otherBookList.forEach(book => {
                    const reviews = book.reviewData;
                    const { ratingStats, overallRating } = calculateRatingStats(reviews);
                    book.ratings = ratingStats;
                    book.overallRating = Math.round(overallRating);
                    book.reviewUserCount = book.reviewData.length
                    book.reviewData = reviews
                });
                return { treandingBookList, newlyAddedBookList, otherBookList }
            }
            else {
                let prefrenceCondition = {}

                if (userInfo.genre_prefernce.length > 0) {
                    var genreCategory = userInfo.genre_prefernce
                    prefrenceCondition['category.categoryName'] = { $in: genreCategory };
                }
                if (userInfo.author_prefernce.length > 0) {
                    var authorCategory = userInfo.author_prefernce
                    prefrenceCondition.authorName = { $in: authorCategory };
                }

                //----------trendingBook---------------------------------------------------------

                if (typeof prefrenceCondition === 'object' && Object.keys(prefrenceCondition).length > 0) {
                    trendingBookQuery.push(
                        {
                            $match: prefrenceCondition
                        }
                    );
                }

                // Add other pipeline stages for trending books

                if (category) {
                    trendingBookQuery.push(
                        {
                            $match: {
                                'category.categoryName': category
                            }
                        },
                        {
                            $sort: { userCount: -1 }
                        },
                        {
                            $lookup: {
                                from: 'review_lists',
                                localField: '_id',
                                foreignField: 'bookId',
                                as: "reviewData"
                            }
                        },
                        // {
                        //     $sort: { created_at: -1 }
                        // },
                        {
                            $limit: 5
                        }
                    );
                    var treandingBookList = await eBook.aggregate(trendingBookQuery);
                    if (treandingBookList.length === 0) {
                        treandingBookList = []
                    }
                }
                // If no books match the user preferences, fetch all books
                if (!category) {
                    if (!authorCategory && !genreCategory) {
                        trendingBookQuery = [
                            {
                                $match: { userCount: { $exists: true } }
                            },
                            {
                                $sort: { userCount: -1 }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            // {
                            //     $sort: { created_at: -1 }
                            // },
                            {
                                $limit: 5
                            }
                        ];
                        treandingBookList = await eBook.aggregate(trendingBookQuery);
                    }
                    if (authorCategory) {
                        var authorQuery = [
                            {
                                $match: {
                                    authorName: { $in: authorCategory }
                                }
                            },
                            {
                                $match: { userCount: { $exists: true } }
                            },
                            {
                                $sort: { userCount: -1 }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            // {
                            //     $sort: { created_at: -1 }
                            // },
                            {
                                $limit: 5
                            }
                        ];
                        var AuthorResponse = await eBook.aggregate(authorQuery);
                    }
                    if (genreCategory) {
                        let categoryQuery = [
                            {
                                $match: {
                                    'category.categoryName': { $in: genreCategory },
                                }
                            },
                            {
                                $match: { userCount: { $exists: true } }
                            },
                            {
                                $sort: { userCount: -1 }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            // {
                            //     $sort: { created_at: -1 }
                            // },
                            {
                                $limit: 5
                            }
                        ];
                        var categoryResponse = await eBook.aggregate(categoryQuery);
                    }
                    if (AuthorResponse && categoryResponse) {
                        const mergedResults = [...AuthorResponse, ...categoryResponse];
                        treandingBookList = Array.from(new Set(mergedResults.map(result => result._id)))
                            .map(_id => mergedResults.find(result => result._id === _id));
                        // treandingBookList = await eBook.aggregate(trendingBookQuery);
                    }
                    else {
                        if (AuthorResponse) {
                            treandingBookList = AuthorResponse
                        }
                        if (categoryResponse) {
                            treandingBookList = categoryResponse
                        }
                    }
                }
                treandingBookList.forEach(book => {
                    const reviews = book.reviewData;
                    const { ratingStats, overallRating } = calculateRatingStats(reviews);
                    book.ratings = ratingStats;
                    book.overallRating = Math.round(overallRating);
                    book.reviewUserCount = book.reviewData.length
                    book.reviewData = reviews
                });

                ///----------------------------newly book ------------------------

                if (typeof prefrenceCondition === 'object' && Object.keys(prefrenceCondition).length > 0) {
                    newAggregatePipe.push(
                        {
                            $match: prefrenceCondition
                        }
                    );
                }
                // Add other pipeline stages for trending books
                if (category) {
                    newAggregatePipe.push(
                        {
                            $match: {
                                'category.categoryName': category
                            }
                        },
                        {
                            $lookup: {
                                from: 'review_lists',
                                localField: '_id',
                                foreignField: 'bookId',
                                as: "reviewData"
                            }
                        },
                        {
                            $sort: { created_at: -1 }
                        }
                    );
                    var newlyAddedBookList = await eBook.aggregate(newAggregatePipe);
                    if (newlyAddedBookList.length === 0) {
                        newlyAddedBookList = []
                    }
                }
                if (!category) {
                    if (!authorCategory && !genreCategory) {
                        newAggregatePipe = [
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            {
                                $sort: { created_at: -1 }
                            }
                        ];

                        newlyAddedBookList = await eBook.aggregate(newAggregatePipe);
                    }
                    if (authorCategory) {
                        var authorQuery = [
                            {
                                $match: {
                                    authorName: { $in: authorCategory }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            {
                                $sort: { created_at: -1 }
                            }
                        ]
                        var authorData = await eBook.aggregate(authorQuery);
                    }
                    if (genreCategory) {
                        let categoryQuery = [
                            {
                                $match: {
                                    'category.categoryName': { $in: genreCategory },
                                }
                            },
                            {
                                $lookup: {
                                    from: 'review_lists',
                                    localField: '_id',
                                    foreignField: 'bookId',
                                    as: "reviewData"
                                }
                            },
                            {
                                $sort: { created_at: -1 }
                            }
                        ]
                        var categoryData = await eBook.aggregate(categoryQuery);
                    }
                    if (authorData && categoryData) {
                        const mergedResults = [...authorData, ...categoryData];
                        newlyAddedBookList = Array.from(new Set(mergedResults.map(result => result._id)))
                            .map(_id => mergedResults.find(result => result._id === _id));
                    }
                    else {
                        if (authorData) {
                            newlyAddedBookList = authorData
                        }
                        if (categoryData) {
                            newlyAddedBookList = categoryData
                        }
                    }
                }
                newlyAddedBookList.forEach(book => {
                    const reviews = book.reviewData;
                    const { ratingStats, overallRating } = calculateRatingStats(reviews);
                    book.ratings = ratingStats;
                    book.overallRating = Math.round(overallRating);
                    book.reviewUserCount = book.reviewData.length
                    book.reviewData = reviews
                });
                //-------------------------other Book----------------------------------------------
                if (authorCategory) {
                    otherAggregatePipe.push(
                        {
                            $match: {
                                authorName: { $in: authorCategory }
                            }
                        },
                    )
                }
                otherAggregatePipe.push(
                    {
                        $match: {
                            'category.categoryName': "Others",
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
                otherAggregatePipe.push(
                    {
                        $lookup: {
                            from: 'review_lists',
                            localField: '_id',
                            foreignField: 'bookId',
                            as: "reviewData"
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
                otherBookList = await eBook.aggregate(otherAggregatePipe)

                otherBookList.forEach(book => {
                    const reviews = book.reviewData;
                    const { ratingStats, overallRating } = calculateRatingStats(reviews);
                    book.ratings = ratingStats;
                    book.overallRating = Math.round(overallRating);
                    book.reviewUserCount = book.reviewData.length
                    book.reviewData = reviews
                });
                return { treandingBookList, newlyAddedBookList, otherBookList }
            }
        } catch (error) {
            throw error;
        }
    }


    async addReviewService(reviewBody) {
        try {
            const userId = reviewBody.userId
            const userInfo = await user.findOne({ _id: userId })
            let reviewInfo
            if (userInfo.userType == 'INSTITUTE_USER') {
                const userwithBookExists = await review.findOne(
                    {
                        userId: new mongoose.Types.ObjectId(reviewBody.userId),
                        bookId: new mongoose.Types.ObjectId(reviewBody.bookId)
                    }
                )
                if (!userwithBookExists) {
                    reviewInfo = await review.create(reviewBody);
                    const id = reviewInfo.userId
                    if (reviewInfo) {
                        const userData = await user.findOne({ _id: id })
                        const reviewId = reviewInfo._id
                        if (userData) {
                            const image = userData.userImage
                            const userName = userData.fullName
                            const updateData = await review.updateMany(
                                { _id: reviewId },
                                {
                                    $set: {
                                        userImage: image,
                                        userName: userName
                                    }
                                },
                                {
                                    new: true
                                }
                            )
                        }
                    }
                    return reviewInfo
                }
                else {
                    return { message: "This user already post review on this book." }
                }
            }
            else {
                const is_BookPurchase = await purchase.findOne(
                    {
                        userId: new mongoose.Types.ObjectId(reviewBody.userId),
                        BookId: new mongoose.Types.ObjectId(reviewBody.bookId),
                        is_purchase: true
                    }
                )
                const userwithBookExists = await review.findOne(
                    {
                        userId: new mongoose.Types.ObjectId(reviewBody.userId),
                        bookId: new mongoose.Types.ObjectId(reviewBody.bookId)
                    }
                )
                if (is_BookPurchase) {
                    if (!userwithBookExists) {
                        reviewInfo = await review.create(reviewBody);
                        const id = reviewInfo.userId
                        if (reviewInfo) {
                            const userData = await user.findOne({ _id: id })
                            const reviewId = reviewInfo._id
                            if (userData) {
                                const image = userData.userImage
                                const userName = userData.fullName
                                const updateData = await review.updateMany(
                                    { _id: reviewId },
                                    {
                                        $set: {
                                            userImage: image,
                                            userName: userName
                                        }
                                    },
                                    {
                                        new: true
                                    }
                                )
                            }
                        }
                        return reviewInfo
                    }
                    else {
                        return { message: "This user already post review on this book." }
                    }
                }
                else {
                    return { message: "User not purchase this book." }
                }
            }

        } catch (error) {
            throw error;
        }
    }

    async eBookInfoService(_id) {
        try {
            function calculateRatingStats(reviews) {
                if (reviews.length === 0) return { ratingStats: [], overallRating: 0 };

                let totalRating = 0;
                const ratingCounts = Array(5).fill(0);

                reviews.forEach(review => {
                    totalRating += review.rating;
                    ratingCounts[review.rating - 1]++;
                });

                const totalReviews = reviews.length;
                const ratingStats = ratingCounts.map((count, index) => ({
                    rating: index + 1,
                    count,
                    percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0
                }));

                const overallRating = totalReviews > 0 ? (totalRating / totalReviews) * 20 : 0;

                return { ratingStats, overallRating };
            }
            let eBookDetail = await eBook.findOne({ _id: new mongoose.Types.ObjectId(_id) });
            if (eBookDetail) {
                const pipeLine = []

                pipeLine.push({ $match: { _id: new mongoose.Types.ObjectId(_id) } },
                    {
                        $lookup: {
                            from: "review_lists",
                            localField: "_id",
                            foreignField: "bookId",
                            as: "reviews"
                        }
                    })
                var eBookInfo = await eBook.aggregate(pipeLine);

                eBookInfo.forEach(book => {
                    const reviews = book.reviews;
                    const { ratingStats, overallRating } = calculateRatingStats(reviews);
                    book.ratings = ratingStats;
                    book.overallRating = Math.round(overallRating);
                    book.reviewUserCount = book.reviews.length
                    book.reviews = reviews
                });
            }
            return { eBookDetail, eBookInfo }
        } catch (error) {
            console.log("error------>", error)
            throw error;
        }
    }

    async exploreBookListService(userId, searchText) {
        try {
            async function calculateRatingStats(reviews) {
                if (reviews.length === 0) return { ratingStats: [], overallRating: 0 };

                let totalRating = 0;
                const ratingCounts = Array(5).fill(0);

                reviews.forEach(review => {
                    totalRating += review.rating;
                    ratingCounts[review.rating - 1]++;
                });
                const totalReviews = reviews.length;
                const overallRating = totalReviews > 0 ? (totalRating / totalReviews) * 20 : 0;

                return { overallRating };
            }
            if (userId) {
                const userInfo = await user.findOne({ _id: userId })
                if (!userInfo) {
                    return { message: "User not found" }
                }
                // var userlanguage = userInfo.language || ""
                if (userInfo.userType == "INSTITUTE_USER") {
                    const instituteId = userInfo.createdBy
                    const assignBook = await instituteBook.findOne({ instituteID: new mongoose.Types.ObjectId(instituteId) })
                    if (!assignBook) {
                        return { message: "This institute not assign any book." }
                    }
                    var booklist = assignBook.BookList
                }
            }
            let eBookList
            const bookaggregate = []
            if (booklist != undefined && booklist.length > 0) {
                bookaggregate.push(
                    {
                        $match: {
                            _id: { $in: booklist }
                        }
                    }
                )
            }
            if (searchText) {
                bookaggregate.push(
                    {
                        $match: {
                            $text: { $search: searchText },
                            // 'bookLanguage.language': userlanguage
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
            }
            bookaggregate.push(
                // {
                //     $match: {
                //         'bookLanguage.language': userlanguage
                //     }
                // },
                {
                    $lookup: {
                        from: 'review_lists',
                        localField: '_id',
                        foreignField: 'bookId',
                        as: "reviewData"
                    }
                },
                {
                    $project: {
                        _id: 1, bookName: 1, authorName: 1, price: 1, bookImage: 1, reviewData: 1
                    }
                },
                {
                    $sort: { created_at: -1 }
                }
            )

            eBookList = await eBook.aggregate(bookaggregate)

            const purchasedBooks = await purchase.find({ userId: userId, is_purchase: true });
            const purchasedBookIds = purchasedBooks.map(book => String(book.BookId));

            eBookList.forEach(async (book) => {
                const reviews = book.reviewData;
                const { overallRating } = await calculateRatingStats(reviews);
                book.overallRating = Math.round(overallRating);
                book.purchase = purchasedBookIds.includes(String(book._id));
            });

            return { eBookList }
        } catch (error) {
            throw error;
        }

    }

    async languageListService() {
        try {
            const languageList = await language.find({}, { _id: 1, language: 1 })
            return languageList
        } catch (error) {
            throw error;
        }
    }
    async addPdfCommentService(data) {
        try {
            const pdfHighlighterDetail = await pdf_Highlighter.create(data)
            return pdfHighlighterDetail
        } catch (error) {
            throw error;
        }
    }
    async getPdfCommentService(userId, bookId) {
        try {
            let pdfInfo
            if (userId && bookId) {
                pdfInfo = await pdf_Highlighter.find(
                    {
                        userId: new mongoose.Types.ObjectId(userId),
                        bookId: new mongoose.Types.ObjectId(bookId)
                    }
                )
            }
            else {
                return { message: "UserId and BookId is required." }
            }
            return pdfInfo
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService;