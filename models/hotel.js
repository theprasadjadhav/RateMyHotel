const joi = require("joi"); 
const mongoose = require("mongoose");
const { Review } = require("./review");
const {cloudinary} = require("../cloudinaryConfig")

const photoSchema = new mongoose.Schema({
     url:String,
    filename:String      
})

photoSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload","/upload/w_200")
})

const hotelSchema =new mongoose.Schema({
    hotel_name: {
        type: String,
        require:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    address:{
        type: String,
        require:true
    },
    photos: [photoSchema],
    overview:{
        type: String,
        require:true
    },
    rating_average: {
        type: Number,
        min: 0,
        max:10,
        require:true
    },
    number_of_ratings: {
        type:Number
    },
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
            coordinates: {
            type: [Number],
            required: true
    }
  }
},
{
    toJSON: { virtuals: true }
}
);

hotelSchema.virtual("getRating").get(function () {
    return this.rating_average.toFixed(1);
})

hotelSchema.virtual("properties.popUpMarkUp").get(function() {
   return `<strong><a href="/hotels/${this._id}">${this.hotel_name}</a></strong >
            <p>${this.address}</p>`
})

const validateHotelSchema = joi.object({
    hotel: joi.object({
        hotel_name: joi.string().required(),
        address: joi.string().required(),
        overview: joi.string().required(),
    }).required(),
    deletePhotos:joi.array()
});

hotelSchema.post('findOneAndDelete', async function (hotel) {
    if (hotel) {
        const reviewsToDelete = await Review.find({ hotel })
        for (let review of reviewsToDelete) {
            await Review.findByIdAndDelete(review._id);   
        }
    }
})


module.exports.Hotel = mongoose.model("Hotel", hotelSchema);

module.exports.validateHotelSchema = validateHotelSchema;