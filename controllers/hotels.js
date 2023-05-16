const { Hotel} = require("../models/hotel");
const { Review } = require("../models/review");
const asyncCatch = require("../utils/asyncCatchFunction")

module.exports.displayHotels = asyncCatch(async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotel/index", { hotels });       
})

module.exports.newHotelForm = (req, res) => {
    res.render("hotel/new");
}

module.exports.createNewHotel = asyncCatch(async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    hotel.author = req.user._id;
    await hotel.save();
    req.flash('success', 'Successfully made a new Hotel!');
    res.redirect(`/hotels`);
})

module.exports.viewHotel = asyncCatch(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findById(id).populate('author','name');
    if (hotel) {
        const hotelId = hotel._id;
        const reviews = await Review.find({ hotel: hotelId }).populate('author', 'name');
        res.render("hotel/view", { hotel,reviews });
    } else {
        req.flash("error", "hotel not found");
        res.redirect(`/hotels`);
    }   
})

module.exports.editHotelForm = asyncCatch(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    res.render("hotel/edit", { hotel });
})

module.exports.editHotel = asyncCatch(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id,{...req.body.hotel});
    res.redirect(`/hotels/${hotel._id}`);   
})

module.exports.deleteHotel = asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hotel')
    res.redirect("/hotels");
})