const express = require("express");
const router = express.Router();
const { Review, validateReviewSchema } = require("../models/review");
const { Hotel } = require("../models/hotel");

/*----------------------async error function--------------------------*/
const asyncCatch = require("../utils/asyncCatchFunction")

/*----------------------error class--------------------------*/
const AppError = require("../utils/errorClass");


/*----------------------validate review middle--------------------------*/
const validateReview = (req, res, next) => {
    const { error } = validateReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
}




router.post("/hotels/:id/reviews",validateReview, asyncCatch(async (req, res) => {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    if (hotel) {
        const review = new Review(req.body.review);
        review.hotel = hotel;
        await review.save();
        res.redirect(`/hotels/${hotelId}`);
    } else {
        throw new AppError("hotel not found", 404);
    }

}))

router.delete("/reviews/:id", asyncCatch(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (review) {
        const hotelId = review.hotel;
        await Review.findByIdAndDelete(id);
        res.redirect(`/hotels/${hotelId}`);
    } else {
        throw AppError("review not found", 404);
    }
}))

module.exports = router;