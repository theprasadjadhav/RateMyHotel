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