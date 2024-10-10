const listing = require("../models/listing");

module.exports.index=async (req, res) => {
    const allListings = await listing.find({}).populate("owner");
   
    res.render("./listings/index.ejs", { allListings , currentUser:req.user });
  }

module.exports.add=(req, res) => {
    res.render("./listings/add.ejs");
  }
module.exports.newListing=async (req, res) => {
    
    let newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.url = req.file.path;
    newListing.image.filename = req.file.filename;

    console.log(newListing);
    await newListing.save();
  
    res.redirect("/listings");
  }

module.exports.edit=async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    var orignalUrl=foundListing.image.url;
    orignalUrl=orignalUrl.replace('/upload','/upload/w_200,h_200,');
    // console.log(orignalUrl);
    res.render("./listings/edit.ejs", { foundListing,orignalUrl });
  }
module.exports.update =async(req, res) => {
    const { id } = req.params;
    const { title, location, price, description } = req.body;
    const updatedListing = await listing.findByIdAndUpdate(id, {
      title,
      location,
      price,
      description,
    });
  const url=req.file.path;
  const filename=req.file.filename;
  updatedListing.image={url,filename};
    await updatedListing.save();
  
    res.redirect("/listings");
  }
module.exports.delete=async (req, res) => {
    const { id } = req.params;
    
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }