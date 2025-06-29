const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const listingsController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get( wrapAsync(listingsController.index))
.post( isLoggedIn,upload.single("image"),validateListing,wrapAsync(listingsController.createlisting))


// NEW Route - Form to add new property
router.get("/new",isLoggedIn, listingsController.newlisting);


router.route("/:id")
.get( wrapAsync(listingsController.showlisting))
.put(isLoggedIn,isOwner,upload.single("image"), validateListing, wrapAsync(listingsController.updatelisting))
.delete(isLoggedIn,isOwner, wrapAsync(listingsController.destroyRoute));


//  EDIT Route - Show edit form
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingsController.editRoute));

module.exports = router;

