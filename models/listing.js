const mongoose = require('mongoose');
const review = require('./reviews.js');

let Schema = mongoose.Schema;
let listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url:String,
        filename:String,
    }
    ,
    

    price:{
        type: Number,
        required: true
    },
    location:{  
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    }
    ,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
    ,
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    

    
});
listingSchema.post('findOneAndDelete', async function (Listing) {
    if (Listing) {
        const res = await review.deleteMany({ _id: { $in: Listing.reviews } });
        console.log(res);
    }
});



let Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
