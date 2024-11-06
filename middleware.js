const Listing=require("./models/listing")
const Review=require("./models/reviews")
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js")
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn= (req,res,next)=>{
    // console.log(req)
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","Please Log In first!")
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
        return;
    }
    next();
}

module.exports.isOwner= async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You dont have permission to update it");
        res.redirect(`/listings/${id}`)
        return;
    }
    next();
}
module.exports.validateListing=(req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error)
        let errmessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmessage);
    }
    else {
        next();
    }
}


module.exports.isAuthor= async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    console.log(req)
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the user of this review");
        res.redirect(`/listings/${id}`)
        return;
    }
    next();
}

module.exports.validateReview=(req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error)
        let errmessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmessage);
    }
    else {
        next();
    }
}