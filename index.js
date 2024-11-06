require('dotenv').config()
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const ejsmate = require("ejs-mate");
const methodoveride = require("method-override")
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session")
const MongoStore = require('connect-mongo');

const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

const listingRouter=require("./router/listings.js")
const reviewRouter=require("./router/reviews.js")
const UserRouter=require("./router/user.js")
const dbURL=process.env.ATLASDB_URL

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
store.on("error",()=>{
    console.log("Error In MONGO SESSION STORE",err);
})
sessiondetails={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true   
    }
}


app.use(session(sessiondetails))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodoveride("_method"))
app.set("views", path.join(__dirname, "views"))   //both path join syntaax remember;
app.use(express.urlencoded({ extended: true }))   ///for to parse body of request
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "/public")))
app.engine("ejs", ejsmate)
// const mongourl = "mongodb://127.0.0.1:27017/wanderlustnew"
main().then(() => {
    console.log("its conneccted");
})
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(dbURL)
}
const port = 8080;


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next();
})

app.get("/addusernew",async (req,res)=>{
    let demouser=new User({
        email:"abc@gmail.com",
        username:"gauri-shanker"
    })
    let result=await User.register(demouser,"my-password");
    res.send(result)
})
app.use("/",UserRouter)
app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)

//middlewares

app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let { StatusCode = 500, message = "Something went Wrong" } = err;
    console.log(err.message)
    res.status(StatusCode).render("listings/error.ejs", { err: { StatusCode, message } });
})

app.listen(port, () => {
    console.log("hello its working on port");
})


//pending to make the signup page