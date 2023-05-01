const express = require("express");
const router = express.Router();
const { Hotel, validateHotelSchema } = require("../models/hotel");
const { Review } = require("../models/review");


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

router.get("/hotels/new",  (req, res) => {
    res.render("hotel/new");
})

router.post("/hotels",validateHotel, asyncCatch(async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    await hotel.save();
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
        throw new AppError("hotel not found", 404);
    }
    
}))

router.get("/hotels/:id/edit", asyncCatch(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if(hotel){
        res.render("hotel/edit", { hotel });
    } else {
        throw new AppError("hotel not found", 404);
    }
   
}))

router.put("/hotels/:id",validateHotel, asyncCatch(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id,{...req.body.hotel},{new:true});
    if (hotel) {
        res.redirect(`/hotels/${hotel._id}`);
    }
    else {
        throw new AppError("hotel not found", 404);
    }
}))

router.delete("/hotels/:id", asyncCatch(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    res.redirect("/hotels");
}))

module.exports = router;