require('dotenv').config();
const mongoose = require("mongoose")
const listings = require("../models/listing")
const data = require("./sampledata")
const mongourl = "mongodb://127.0.0.1:27017/wanderlustnew"

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_PUBLIC_TOKEN
console.log(mapToken, "hello is xsx")
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// mapboxgl.accessToken = MAP_PUBLIC_TOKEN;

main().then(() => {
    console.log("its conneccted");
})
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(mongourl)
}

let initDB = async () => {
    await listings.deleteMany({});
    data.data = data.data.map((obj) => ({ ...obj, owner: "66eecab9adf9ef4211331d71" }))
    await listings.insertMany(data.data)
    console.log("all files added");
}
let initDBcategory = async () => {
    await listings.deleteMany({});
    const valuelocation = async function getcoordinates(locationvalue) {
        console.log(locationvalue)
        return await geocodingClient.forwardGeocode({
            query: locationvalue,
            limit: 1
        }).send()
    };
    data.data = await Promise.all(
        data.data.map(async (obj) => {
            const coordinates = await valuelocation(obj.location); // Await the result of getcoordinates
            console.log(coordinates);
            return { ...obj, geometry: coordinates.body.features[0].geometry, owner: "66eecab9adf9ef4211331d71", category: "Home" };
        }));
    // data.data = data.data.map((obj) => ({
    //     ...obj,
    //     const coordinates = await valuelocation(obj.location);
    //     category: "Others"
    // }))
    await listings.insertMany(data.data)
    console.log("all files added");
}
initDBcategory();