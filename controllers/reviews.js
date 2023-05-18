const asyncCatch = require("../utils/asyncCatchFunction")
const { Review} = require("../models/review");
const { Hotel } = require("../models/hotel");
const {cloudinary} = require("../cloudinaryConfig")


module.exports.createReview = asyncCatch(async (req, res) => {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    if (hotel) {
        const review = new Review(req.body.review);
        review.photos = req.files.map(f => ({ url: f.path, filename: f.filename }));
        review.hotel = hotel;
        review.author = req.user._id;
        await review.save();
        req.flash('success', 'Successfully added review')
        res.redirect(`/hotels/${hotelId}`);
    } else {
        req.flash("error", "hotel not found");
        res.redirect(`/hotels`);
    }
})

module.exports.deleteReview = asyncCatch(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    for (let img of review.photos) {
        await cloudinary.uploader.destroy(img.filename);
    }
    const hotelId = review.hotel;
    await Review.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/hotels/${hotelId}`);
   
})