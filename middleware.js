const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");

//Checks to see if a user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //store URL they are requesting
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first");
    return res.redirect("/login");
  }
  next();
};

//CAMPGROUND MIDDLEWARE:
//Makes sure the campground submitted follows the permitted schema
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Makes sure someone deleting/updating a campground is the original author
module.exports.isCampgroundAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You must be the author of the campground to edit it");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

//REVIEW MIDDLEWARE
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You must be the author of the review to edit it");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
