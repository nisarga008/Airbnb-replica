const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js")



const listingSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    country: String,
    image: {
      url:String,
      filename:String,
},
// type: new Schema({
    //     url: {
    //         type: String,
    //         default: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    //         set: (v) =>
    //             v === "" ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60" : v,
    //     },
    // }),
    // default: () => ({})

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    }
});

//mongoose middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
