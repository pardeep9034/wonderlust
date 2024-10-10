const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const expresserr = require("../utils/expresserr.js");
const {isloggedin,isOwner,validateListing,} = require("../utils/middelwares.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudinary_config.js");
const upload = multer({storage})

router.get("/", wrapAsync(listingController.index));
router.get("/add", isloggedin, wrapAsync(listingController.add));
// router.post("/", validateListing, wrapAsync(listingController.newListing));
router.post("/",upload.single('listing[image]'),wrapAsync(listingController.newListing))

router.get("/:id/edit", isloggedin, isOwner, wrapAsync(listingController.edit));

router.put("/:id", isOwner,upload.single('image'), wrapAsync(listingController.update));
router.delete("/:id", isloggedin, isOwner, wrapAsync(listingController.delete));

module.exports = router;
