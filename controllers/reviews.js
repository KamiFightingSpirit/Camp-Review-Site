/*
 * Used for all of the logic for each of our review routes
 */
const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  //the mongo $pull operator removes all instances of a value from an array
  const result = await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/campgrounds/${id}`);
};
