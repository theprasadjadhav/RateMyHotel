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



router.get("/hotels", asyncCatch(async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotel/index", { hotels });       
}))

router.get("/hotels/new", isLogedIn, (req, res) => {
    res.render("hotel/new");
})

router.post("/hotels",isLogedIn,validateHotel, asyncCatch(async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    await hotel.save();
    req.flash('success', 'Successfully made a new Hotel!');
    res.redirect(`/hotels`);

}))


router.get("/hotels/:id", asyncCatch(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (hotel) {
        const hotelId = hotel._id;
        const reviews = await
         Review.find({ hotel: hotelId });
        res.render("hotel/view", { hotel,reviews });
    } else {
        req.flash("error", "hotel not found");
        res.redirect(`/hotels`);
    }
    
}))

router.get("/hotels/:id/edit",isLogedIn, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if(hotel){
        res.render("hotel/edit", { hotel });
    } else {
        throw new AppError("hotel not found", 404);
    }
   
}))

router.put("/hotels/:id",isLogedIn,validateHotel, asyncCatch(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id,{...req.body.hotel},{new:true});
    if (hotel) {
        res.redirect(`/hotels/${hotel._id}`);
    }
    else {
        throw new AppError("hotel not found", 404);
    }
}))

router.delete("/hotels/:id",isLogedIn, asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hotel')
    res.redirect("/hotels");
}))

module.exports = router;