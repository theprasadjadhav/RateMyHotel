const joi = require("joi"); 
const mongoose = require("mongoose");

const hotelSchema =mongoose.Schema({
    hotel_name: {
        type: String,
        require:true
    },
    addressline1:{
        type: String,
        require:true
    },
    photo1: {
        type: String,
        require:true
    },
    overview:{
        type: String,
        require:true
    },
    rating_average: {
        type: Number,
        min: 0,
        max:10,
        require:true
    }
});

const Hotel =mongoose.model("Hotel", hotelSchema);

const validateHotelSchema = joi.object({
    hotel: joi.object({
        hotel_name: joi.string().required(),
        addressline1: joi.string().required(),
        photo1: joi.string().required(),
        overview: joi.string().required(),
        rating_average: joi.number().required().min(0).max(10)
    }).required()
});


module.exports.Hotel = Hotel;
module.exports.validateHotelSchema = validateHotelSchema;