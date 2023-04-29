const express = require("express");
const router = express.Router();
const { Review, validateReviewSchema } = require("../models/review");
const { Hotel } = require("../models/hotel");

/*----------------------async error function--------------------------*/
const asyncCatch = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

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

/*----------------------error class--------------------------*/
class AppError extends Error{
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
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

module.exports = router;