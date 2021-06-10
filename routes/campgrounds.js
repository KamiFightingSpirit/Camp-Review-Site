/*
 * Used to call middleware and controller methods that we have defined
*/
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer')//parses form data to allow image uploads
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    //Show all campgrounds
    .get(catchAsync(campgrounds.index))
    //add a new campground -> post
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));


//Create new campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    //Show single campground
    .get(catchAsync(campgrounds.showCampground))
    //edit a campground -> post
    .put(isLoggedIn, isCampgroundAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))
    //delete a campground -> delete
    .delete(isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.deleteCampground));

//edit a campground -> get
router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.renderEditForm));


module.exports = router;