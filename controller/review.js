const listing = require("../models/listing");
const review = require("../models/reviews.js");

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const showlisting = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  res.render("./review/show.ejs", { showlisting, currentUser: req.user });
};
module.exports.newReview = async (req, res) => {
  const { id } = req.params;
  const Listing = await listing.findById(id);
  let newReview = new review(req.body.review);
  newReview.author = req.user._id;

  Listing.reviews.push(newReview);
  await newReview.save();
  await Listing.save();
  req.flash("success", "Review Added Successfully!");
  res.redirect(`/listings/${id}/reviews/show/${id}`);
};
module.exports.deleteReview = async (req, res) => {
  const { id, reviewid } = req.params;

  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await review.findByIdAndDelete(reviewid);
  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}/reviews/show/${id}`);
};
