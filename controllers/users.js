const User = require("../models/user.js")
const passport = require("passport")

module.exports.renderSignUpform=(req, res) => {
    res.render("./users/signup.ejs")
    // res.send("signuppage")
}

module.exports.signupRoute=async (req, res) => {
    try {
        let { username, password, email } = req.body;
        const newUser = new User({ email, username })
        let result = await User.register(newUser, password);
        console.log(result)
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
        req.flash("success",`Welcome ${username} to WanderLust`)
       let  redirecturl=res.locals.redirectUrl || "/listings"
        res.redirect(redirecturl)
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}
module.exports.loginForm=(req, res) => {
    res.render("./users/login.ejs");
}

module.exports.login=async (req, res) => {
    req.flash("success","Welcome To WanderLust")
   let  redirecturl=res.locals.redirectUrl || "/listings"
    res.redirect(redirecturl);
}

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","You Are Logged Out");
    res.redirect("/listings")
    })
}
module.exports.profilepage=(req,res)=>{
    res.render("./users/profilepage.ejs")
}