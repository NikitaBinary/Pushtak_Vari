const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryImage: {
        type: String,
    },
    categoryName: {
        type: String,
    },
    marathiName:{
        type: String,
    },
    is_selected:{
        type:Boolean,
        default:false
    },
    language:{
        type: JSON
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const category = mongoose.model("category", categorySchema);
module.exports = category;