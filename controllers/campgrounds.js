/*
 * Used for all of the logic for each of our campground routes
 */
const Campground = require("../models/campground");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeoCoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

//Show all campgrounds
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

//Create new campground form
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

//add a new campground -> post
module.exports.createCampground = async (req, res, next) => {
  //Alternate way to throw a local error
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully added campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

//Show single campground
module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  //We have to populate both the author of the review and the campground
  const campground = await Campground.findById(id)
    .populate("author")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });
  if (!campground) {
    req.flash("error", "That campground was not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

//edit a campground -> get
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "That campground was not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

//edit a campground -> post
module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
    //remove the files from cloudinary
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    //update the campground in the database
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${id}`);
};

//delete a campground -> delete
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
