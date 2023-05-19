const { Hotel, validateHotelSchema } = require("../models/hotel");
const { Review, validateReviewSchema } = require("../models/review");
const AppError = require("../utils/errorClass");


module.exports.isLogedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Login required");
        res.redirect("/login");
    } else {
        next();
    }
}

module.exports.isLogedOut = function (req, res, next) {
    if (req.isAuthenticated()) {
        req.flash("error", "Already loged in")
        res.redirect("/hotels");
    } else {
        next();
    }
}

module.exports.storeReturnTo = function (req, res, next) {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;        
    }
    next();
}

module.exports.validateHotel = (req, res, next) => {
    const { error } = validateHotelSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isHotelAuthor = async (req, res, next) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (hotel) {
        if (hotel.author.equals(req.user._id)) {
            next();
        } else {
            req.flash("error", "You do not have permission to do this")
            res.redirect("/hotels")
        }
    }
    else {
        req.flash("error", "Hotel not found");
        res.redirect("/hotels")
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = validateReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
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

module.exports.deleteRating = async (req, res, next) => {
    const { hotelId,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    const hotel = await Hotel.findById(hotelId);

    total_ratings = hotel.number_of_ratings;
    if (total_ratings === 1) {
        hotel.rating_average = 0
        hotel.number_of_ratings = 0;
     } else {
        avg_rating = hotel.rating_average;
        avg_rating *= total_ratings;
        avg_rating = (avg_rating - review.rating) / (total_ratings - 1);
        hotel.rating_average = avg_rating;
        hotel.number_of_ratings = total_ratings - 1;
    }
    await hotel.save(); 
    next();
}

module.exports.addRating = async (req, res, next) => {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    if (hotel) {
        let avg_rating = hotel.rating_average;
        let total_number_ratings = hotel.number_of_ratings;
        let total_rating = avg_rating * total_number_ratings;
        total_rating += parseInt(req.body.review.rating);

        hotel.rating_average = total_rating / (total_number_ratings + 1);
        hotel.number_of_ratings += 1;
       
        await hotel.save(); 
        next();
    }else {
        req.flash("error", "Hotel not found");
        res.redirect("/hotels")
    }
}