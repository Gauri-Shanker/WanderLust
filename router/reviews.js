const express = require("express")
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync.js")

const { isLoggedIn, isAuthor,validateReview} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//review delete route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.deleteRoute))
//new route
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.newReviewRoute))

module.exports = router