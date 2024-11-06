const Listing = require("../models/listing.js")
const Review=require("../models/reviews.js")
module.exports.deleteRoute=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted!")

    res.redirect(`/listings/${id}`)
}

module.exports.newReviewRoute=async (req, res) => {
    console.log(req.params.id)
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author=req.user._id
    console.log(newreview); 
    listing.reviews.push(newreview)
    await newreview.save();
    await listing.save();
    console.log("new review svaed");
    req.flash("success","New Review Created")

    res.redirect(`/listings/${listing.id}`)

}