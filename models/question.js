require("dotenv").config()

const mongoose = require('mongoose')

mongoose.connect(process.env.URL)

const questionSchema = new mongoose.Schema({
    question: {
        type:String
    },
    option1: {
        type:String
    },
    option2: {
        type:String
    },
    option3: {
        type:String
    },
    option4: {
        type:String
    },
    answer: {
        type:Number,
        enum: [1, 2, 3, 4]
    }
})

module.exports = mongoose.model('Question',questionSchema)