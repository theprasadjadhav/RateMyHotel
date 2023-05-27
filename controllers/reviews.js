const asyncCatch = require("../utils/asyncCatchFunction")
const { Review} = require("../models/review");
const { Hotel } = require("../models/hotel");

module.exports.createReview = asyncCatch(async (req, res) => {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
   
    const review = new Review(req.body.review);
    review.photos = req.files.map(f => ({ url: f.path, filename: f.filename }));
    review.hotel = hotel;
    review.author = req.user._id;
    await review.save();

    req.flash('success', 'Successfully added review')
    res.redirect(`/hotels/${hotelId}`);
})

module.exports.deleteReview = asyncCatch(async (req, res) => {
    const { hotelId,reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/hotels/${hotelId}`);
   
})