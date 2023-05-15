const express = require("express");
const router = express.Router();
const { Review, validateReviewSchema } = require("../models/review");
const { Hotel } = require("../models/hotel");
const { isLogedIn } = require("../utils/middlewares");


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

const isReviewAuthor = async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (review) {
        if (review.author.equals(req.user._id)) {
            next();
        } else {
            hotelId = review.hotel;
            req.flash("error", "You do not have permission to do this")
            res.redirect(`/hotels/${hotelId}`)
        }
    }
    else {
        req.flash("error", "Review not found");
        res.redirect("/hotels")
    }
}



router.post("/hotels/:id/reviews",isLogedIn,validateReview, asyncCatch(async (req, res) => {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    if (hotel) {
        const review = new Review(req.body.review);
        review.hotel = hotel;
        review.author = req.user._id;
        await review.save();
        req.flash('success', 'Successfully added review')
        res.redirect(`/hotels/${hotelId}`);
    } else {
        throw new AppError("hotel not found", 404);
    }

}))

router.delete("/reviews/:id",isLogedIn,isReviewAuthor, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    const hotelId = review.hotel;
    await Review.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/hotels/${hotelId}`);
   
}))

module.exports = router;