const Listing=require("../Models/listing.js");
const Review=require("../Models/review.js")

module.exports.createReview=async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);
review.auther = req.user._id;
  await review.save();

  listing.reviews.push(review);
  await listing.save();

  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
}