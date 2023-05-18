const { Hotel} = require("../models/hotel");
const { Review } = require("../models/review");
const {cloudinary} = require("../cloudinaryConfig")
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
    hotel.photos = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hotel.rating_average = 0;
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
    const hotel = await Hotel.findByIdAndUpdate(id, { ...req.body.hotel });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hotel.photos.push(...imgs);
    await hotel.save();
    if (req.body.deletePhotos) {
        for (filename of req.body.deletePhotos) {
            await cloudinary.uploader.destroy(filename);
        }
        await hotel.updateOne({ $pull: { photos: { filename: { $in: req.body.deletePhotos } } } });
    }
    res.redirect(`/hotels/${hotel._id}`);   
})

module.exports.deleteHotel = asyncCatch(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    for (photo of hotel.photos) {
            await cloudinary.uploader.destroy(photo.filename);
        }
    await Hotel.findByIdAndDelete(id);    
    req.flash('success', 'Successfully deleted hotel')
    res.redirect("/hotels");
})