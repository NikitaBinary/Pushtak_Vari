const mongoose = require('mongoose');

const instituteAssignBookSchema = new mongoose.Schema({
    instituteID: {
        type:  mongoose.Schema.Types.ObjectId,
    },
    BookList: {
        type: Array
    }

},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const bookAssign = mongoose.model("institute_bookAssign", instituteAssignBookSchema);
module.exports = bookAssign;