const mongoose = require('mongoose')

const APISchema = mongoose.Schema({
    _id:String
})

module.exports = mongoose.model('API',APISchema)