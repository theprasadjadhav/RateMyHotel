const mongoose = require("mongoose");
const baseJoi = require("joi");
const escapeHTMLExtension = require("../utils/joiSanitizeHTML");
const {cloudinary} = require("../cloudinaryConfig")


const photoSchema = new mongoose.Schema({
    url:String,
    filename:String      
})

photoSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload","/upload/w_100")
})

const reviewSchema = new mongoose.Schema({
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
    },
    photos: [photoSchema],
})

reviewSchema.post('findOneAndDelete', async function (data,next) {
    if (data) {
      for (let img of data.photos) {
        await cloudinary.uploader.destroy(img.filename);
        }
    }
    next();
});


const joi = baseJoi.extend(escapeHTMLExtension);
const validateReviewSchema = joi.object({
  review: joi
    .object({
      body: joi.string().required().escapeHTML(),
      rating: joi.number().min(0).max(5).required(),
    })
    .required(),
});




module.exports.Review = mongoose.model("Review", reviewSchema);
module.exports.validateReviewSchema = validateReviewSchema;

