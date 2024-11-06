const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_PUBLIC_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.newPageRoute = (req, res) => {
    res.render("listings/new.ejs");
}
module.exports.newListing = async (req, res, next) => {
    const coordinates = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()
    // console.log()/''
    // res.send("revert back");

    let url = req.file.path;
    let fileName = req.file.filename;
    let listingdata = new Listing(req.body.listing);
    console.log(listingdata)
    listingdata.geometry = coordinates.body.features[0].geometry
    listingdata.owner = req.user._id
    listingdata.image = { url, fileName }
    let savedresponse = await listingdata.save();
    console.log(savedresponse);
    req.flash("success", "New Listing Added")
    res.redirect("listings");

}

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log("listing updated")
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let fileName = req.file.filename;
        listing.image = { url, fileName };
        await listing.save();
    }

    req.flash("success", "Listing Updated")

    res.redirect(`/listings/${id}`);
}
module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")

    res.redirect("/listings");
}

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);
    if (!listings) {
        req.flash("error", "Listing you are requested doesn't exists!")
        res.redirect("/listings")
    }
    let originalurl = listings.image.url;
    console.log(originalurl)
    originalurl = originalurl.replace("/upload", "/upload/h_300")
    console.log(originalurl)

    res.render("listings/edit.ejs", { listings, originalurl });
}

module.exports.allListingRoute = async (req, res) => {
    let category = req.query.category
    let searchTerm = req.query.search
    let listingdata;
    console.log(category)

    try {
        let searchConditions = {};
        const searchRegex = new RegExp(searchTerm, 'i')
        console.log(searchRegex)
        if (searchTerm) {
            searchConditions = {
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { location: searchRegex },
                    { country: searchRegex },
                    { category: searchRegex },
                ]
            };
            const price = parseFloat(searchTerm);
            if (!isNaN(price)) {
                searchConditions.$or.push({ price: price });
            }
            console.log(searchConditions)
            listingdata = await Listing.find(searchConditions);
            res.render("listings/listing.ejs", { listingdata });
            return;
        }
        if (category) listingdata = await Listing.find({ category });
        else listingdata = await Listing.find({});
        res.render("listings/listing.ejs", { listingdata });
    }


    catch (error) {
        console.log("Errro in finding");
        res.status(500).send("An error");
    }
}
// module.exports.searchlisting=async(req,res)=>{
//     let category=req.query.category
//     res.render("")
// }

module.exports.showRoute = async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author"
        }
    }).populate("owner");
    console.log(listing)
    if (!listing) {
        req.flash("error", "Listing you are requested doesn't exists!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })

}