const express = require("express");
const router = express.Router();
const { isLogedIn,validateReview,isReviewAuthor } = require("../utils/middlewares");
const reviewControllers = require("../controllers/reviews");


router.post("/hotels/:id/reviews",isLogedIn,validateReview, reviewControllers.createReview)

router.delete("/reviews/:id",isLogedIn,isReviewAuthor, reviewControllers.deleteReview)

module.exports = router;