const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../Models/listing.js");
const Review=require("../Models/review.js")
const {validateReview,isLoggedIn,isAuther}=require("../middleware.js")
const reviewController=require("../controllers/reviews.js")



router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete review route



router.delete("/:reviewId", isLoggedIn, isAuther, wrapAsync(reviewController.destroyReview));




module.exports = router;

