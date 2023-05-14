const express = require("express");
const router = express.Router();
const { Hotel, validateHotelSchema } = require("../models/hotel");
const { Review } = require("../models/review");
const { isLogedIn } = require("../utils/middlewares");


/*----------------------async error function--------------------------*/
const asyncCatch = require("../utils/asyncCatchFunction")

/*----------------------error class--------------------------*/
const AppError = require("../utils/errorClass");


/*----------------------validate hotel middle--------------------------*/
const validateHotel = (req, res, next) => {
    const { error } = validateHotelSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
}

const isHotelAuthor = async (req, res, next) => {
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


router.get("/hotels", asyncCatch(async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotel/index", { hotels });       
}))

router.get("/hotels/new", isLogedIn, (req, res) => {
    res.render("hotel/new");
})

router.post("/hotels",isLogedIn,validateHotel, asyncCatch(async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    hotel.author = req.user._id;
    await hotel.save();
    req.flash('success', 'Successfully made a new Hotel!');
    res.redirect(`/hotels`);

}))


router.get("/hotels/:id", asyncCatch(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findById(id).populate('author','name');
    if (hotel) {
        const hotelId = hotel._id;
        const reviews = await Review.find({ hotel: hotelId }).populate('author', 'name');
        console.log(reviews);
        res.render("hotel/view", { hotel,reviews });
    } else {
        req.flash("error", "hotel not found");
        res.redirect(`/hotels`);
    }
    
}))

router.get("/hotels/:id/edit",isLogedIn,isHotelAuthor, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    res.render("hotel/edit", { hotel });
}))

router.put("/hotels/:id",isLogedIn,isHotelAuthor, validateHotel, asyncCatch(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id,{...req.body.hotel},{new:true});
    res.redirect(`/hotels/${hotel._id}`);
    
}))

router.delete("/hotels/:id",isLogedIn,isHotelAuthor, asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hotel')
    res.redirect("/hotels");
}))

module.exports = router;