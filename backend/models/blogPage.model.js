const mongoose = require('mongoose');;

const blog  = new mongoose.Schema({
    originalCreatorId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Title : {
        type : String,
        required : true 
    },
    Content : {
        type : String,
        required : true
    },
    Author : {
        type : String,
        required : true
    },
    

},{timestamps : true,versionKey : false}) 

module.exports = mongoose.model('Blog' , blog);