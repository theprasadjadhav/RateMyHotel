if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

/*----------------------require--------------------------*/
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStategy = require("passport-local");

const { User } = require("./models/user");

const userRoutes = require("./routes/userRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const AppError = require("./utils/errorClass");

/*----------------------creating app--------------------------*/
const app = express();

/*----------------------mongoose connection--------------------------*/
mongoose.connect("mongodb://127.0.0.1:27017/hotel");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

/*----------------------setting--------------------------*/
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));

/*----------------------use--------------------------*/
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "this is secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7     
    }
}));

app.use(flash());

/*---------------------passport--------------------------*/
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*----------------------flash middleware--------------------------*/
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


/*----------------------hotel routes--------------------------*/
app.use("/", userRoutes);
app.use("/", hotelRoutes);
app.use("/", reviewRoutes);

app.all("*", (req, res) => {
    throw new AppError(404, "page not found");
})

/*----------------------error handling route--------------------------*/

app.use((err, req, res, next) => {
    // if (!(err instanceof AppError)) {
    //     err.message = "page not found";
    //     err.status = 404;
    // } 
    res.render("error", { err });   
})


/*----------------------listning--------------------------*/
app.listen("3000", () => {
    console.log("listening on port 3000");
})

