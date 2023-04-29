const express = require("express");
const router = express.Router();
const { Hotel,validateHotelSchema } = require("../models/hotel");

function asyncError(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

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

router.get("/hotels", asyncError(async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotel/index", { hotels });       
}))

router.get("/hotels/new",  (req, res) => {
    res.render("hotel/new");
})

router.post("/hotels",validateHotel, asyncError(async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    await hotel.save();
    res.redirect(`/hotels`);

}))


router.get("/hotels/:id", asyncError(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if(hotel){
        res.render("hotel/view", { hotel });
    } else {
        throw new routerError("hotel not found", 404);
    }
    
}))

router.get("/hotels/:id/edit", asyncError(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if(hotel){
        res.render("hotel/edit", { hotel });
    } else {
        throw new routerError("hotel not found", 404);
    }
   
}))

router.put("/hotels/:id",validateHotel, asyncError(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id,{...req.body.hotel},{new:true});
    if (hotel) {
        res.redirect(`/hotels/${hotel._id}`);
    }
    else {
        throw new routerError("hotel not found", 404);
    }
}))

router.delete("/hotels/:id", asyncError(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    res.redirect("/hotels");
}))

module.exports = router;