const express = require("express");
const router = express.Router({mergeParams: true,});
const wrapAsync = require("../utils/wrapasync.js");
const {isReviewOwner,validateReview, isloggedin}=require('../utils/middelwares.js');
const reviewController = require("../controller/review.js");



  router.get("/show/:id",wrapAsync(reviewController.show));  
  router.post("/",validateReview,wrapAsync(reviewController.newReview));
  router.delete("/:reviewid",isloggedin, isReviewOwner,  wrapAsync(reviewController.deleteReview));
    
  module.exports = router;