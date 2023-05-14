const mongoose = require("mongoose");
const joi = require("joi");

const reviewSchema = new mongoose.Schema({
    heading: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    body: {
        type: String,
        require:true
    },
    rating: {
        type: Number,
        require: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Hotel'
    }
})

const validateReviewSchema = joi.object({
    review: joi.object({
        heading: joi.string().required(),
        body: joi.string().required(),
        rating:joi.number().min(0).max(5).required()
   }).required()
})


module.exports.Review = mongoose.model("Review", reviewSchema);
module.exports.validateReviewSchema = validateReviewSchema;

