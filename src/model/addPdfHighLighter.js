const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    HighlightText: [
        {
            type: Array,
            default: []
        }
    ]


},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });


const pdf_Highlighter = mongoose.model("pdf_Highlighter", pdfSchema);
module.exports = pdf_Highlighter;