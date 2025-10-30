const Listing = require('../models/listing');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const reviewSchema = require('../schema').reviewSchema;

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError('Listing not found', 404);

  const newReview = new Review({
    reviewerName: req.body.reviewerName,
    rating: req.body.rating,
    comment: req.body.comment,
    productId: listing._id,
    author: req.user._id
    //userId: mongoose.Types.ObjectId(),
  });

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};