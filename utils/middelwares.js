const listing=require('../models/listing');
const expresserr = require("./expresserr");
const { listingSchema,reviewSchema } = require("../schema.js");

module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}



module.exports.saveRedirecturl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    const { id } = req.params;
    let Listing=await listing.findById(id);
    console.log(Listing);
    if(!Listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "You do not have permission to do that");
        res.redirect(`/listings/id/reviews/show/${id}`);
    }
    next();
}
module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewid } = req.params;
    
    
    // Find the listing by its ID
    let Listing = await listing.findById(id).populate('reviews'); 
    

    // Find the specific review from the listing's reviews array
    const review = Listing.reviews.find((r) => r._id.equals(reviewid));
    
  
    
    // Check if the current user is the owner of the review
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to do that.");
        return res.redirect(`/listings/id/reviews/show/${id}`);
    }
    
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new expresserr(msg, 400);
    } else {
      next();
    }
  };

  module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new expresserr(msg, 400);
    } else {
      next();
    }
  };