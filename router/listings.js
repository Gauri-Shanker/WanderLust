const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js")
const lisitingcontroller = require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage})

router.route("/")
.get( wrapAsync(lisitingcontroller.allListingRoute))  //All Listing Route
// .post(,(req,res)=>{
//     res.send(req.file);
// })
.post(isLoggedIn, upload.single('listing[image]'),validateListing ,wrapAsync(lisitingcontroller.newListing))

// router.route("/search")
// .get(wrapAsync(lisitingcontroller.searchlisting))
//new Route

router.get("/new",isLoggedIn,lisitingcontroller.newPageRoute )

router.route("/:id")
.put(isLoggedIn,isOwner,upload.single('listing[image]') ,validateListing, wrapAsync(lisitingcontroller.updateRoute))  //update route
.delete(isLoggedIn,isOwner, wrapAsync(lisitingcontroller.deleteRoute)) // Delete Route 
.get( wrapAsync(lisitingcontroller.showRoute)) //show route

// Edit Route 
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(lisitingcontroller.editRoute))


module.exports=router