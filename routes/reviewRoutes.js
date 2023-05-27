const express = require("express");
const router = express.Router();
const { isLogedIn,validateReview,isReviewAuthor,deleteRating,addRating } = require("../utils/middlewares");
const reviewControllers = require("../controllers/reviews");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig");
const upload = multer({ storage });

router.post("/hotels/:id/reviews",isLogedIn,upload.array('photos'),validateReview,addRating, reviewControllers.createReview)

router.delete("/hotels/:hotelId/reviews/:reviewId",isLogedIn,isReviewAuthor,deleteRating, reviewControllers.deleteReview)

module.exports = router;