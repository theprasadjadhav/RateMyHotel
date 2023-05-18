const express = require("express");
const router = express.Router();
const { isLogedIn,validateReview,isReviewAuthor } = require("../utils/middlewares");
const reviewControllers = require("../controllers/reviews");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig");
const upload = multer({storage});


router.post("/hotels/:id/reviews",isLogedIn,upload.array('photos'),validateReview, reviewControllers.createReview)

router.delete("/reviews/:id",isLogedIn,isReviewAuthor, reviewControllers.deleteReview)

module.exports = router;