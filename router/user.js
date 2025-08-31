const express = require("express")
const { default: mongoose } = require("mongoose")
const router = express.Router({ mergeParams: true })
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const flash = require("connect-flash")
const passport = require("passport")
const {saveRedirectUrl}=require('../middleware.js')
const userController=require("../controllers/users.js")
const {isLoggedIn}=require("../middleware.js")
const lisitingcontroller = require("../controllers/listings.js");

router.route("/")
.get( wrapAsync(lisitingcontroller.allListingRoute))

router.route("/signup")
.get( userController.renderSignUpform)
.post(saveRedirectUrl, wrapAsync(userController.signupRoute))


router.route("/login")
.get( userController.loginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login)
//logout route
router.route("/profile")
.get(isLoggedIn,wrapAsync(userController.profilepage))

router.get("/logout",userController.logout)

module.exports = router
