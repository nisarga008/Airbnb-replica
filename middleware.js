const Listing=require("./Models/listing.js")
const Review=require("./Models/review.js")
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
    req.flash("error", "You must be logged in to create listings");
    return res.redirect("/login"); // 🔁 return added here
  }
  next();
}


//if we craet local varial then pass don not have access to change it otherwise it will change
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  
  //  FIX: Check if current user is NOT the owner
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports. validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    const errmsg = result.error.details.map(e => e.message).join(", ");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports. validateReview=(req,res,next)=>{
let result=reviewSchema.validate(req.body);
    if(result.error){
      let errmsg=result.error.details.map((e)=>{
        e.message
      }).join(",");
      throw new ExpressError(400,errmsg);
    }else{
      next(); 
    }
}


module.exports.isAuther = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  // Check ownership
  if (!review.auther.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of the review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

