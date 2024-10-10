const mongoose = require('mongoose');
let sampleListings = require('./data');
let listing=require('../models/listing.js');
require('dotenv').config();








main().then((res) => {
    console.log("Connected to MongoDB");
    
  
    })
    .catch((err) => {
        console.log(err);
    })
    
async function main() {
    await mongoose.connect("mongodb+srv://CHATNEST:PARDEEP@deployment.m9ketuc.mongodb.net/Wonderlust?retryWrites=true&w=majority&appName=DEPLOYMENT");}

    
let initDb=async ()=>{
    await listing.deleteMany({});
    sampleListings=sampleListings.map((listing)=>({
        ...listing,
        owner:"66e95c9a8ed5fbea8d943340"
    }))


    await listing.insertMany(sampleListings);
}
 initDb()