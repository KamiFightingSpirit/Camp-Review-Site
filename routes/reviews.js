const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");

//Route for posting a review to the database
router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

//route for deleting a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
