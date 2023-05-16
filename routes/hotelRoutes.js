const express = require("express");
const router = express.Router();

const { isLogedIn,isHotelAuthor,validateHotel } = require("../utils/middlewares");
const hotelControllers = require("../controllers/hotels")


router.get("/hotels", hotelControllers.displayHotels)

router.get("/hotels/new", isLogedIn, hotelControllers.newHotelForm)

router.post("/hotels",isLogedIn,validateHotel, hotelControllers.createNewHotel)

router.get("/hotels/:id", hotelControllers.viewHotel)

router.get("/hotels/:id/edit",isLogedIn,isHotelAuthor, hotelControllers.editHotelForm)

router.put("/hotels/:id",isLogedIn,isHotelAuthor, validateHotel, hotelControllers.editHotel)

router.delete("/hotels/:id",isLogedIn,isHotelAuthor, hotelControllers.deleteHotel)

module.exports = router;