const express = require("express");
const router = express.Router();
const { User, validateUserSchema } = require("../models/user");
const asyncCatch = require("../utils/asyncCatchFunction");
const AppError = require("../utils/errorClass");
const passport = require("passport");
const { isLogedOut, isLogedIn,storeReturnTo } = require("../utils/middlewares");


const validateUser = function (req, res, next) {
    const { error } = validateUserSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        req.flash("error", msg);
        res.redirect("/register")
    }
    else {
        next();
    }
}


router.get("/register", isLogedOut, (req, res) => {
    res.render("user/register");
})

router.post("/register",isLogedOut,validateUser,asyncCatch( async (req, res,next) => {
    try {
        const { email,name, username, password } = req.body;

        const isEmailExist = await User.findOne({email});
        if (isEmailExist) {
            throw new AppError("A user with the given email address is already registered");
        } else {
            const user = new User({ email,name,username });
            const newUser = await User.register(user, password);
            req.login(newUser, (err) => {
                if (err) {
                    next(err);
                }
                req.flash("success", "Welcome");
                res.redirect("/hotels");
            })
        }
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
}))

router.get("/login",isLogedOut, (req, res) => {
    res.render("user/login");
})

router.post("/login",isLogedOut,storeReturnTo,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}) , (req, res) => { 
    req.flash("success", "Welcome Back")
    const url = res.locals.returnTo || "/hotels";
    res.redirect(url);
})

router.get("/logout",isLogedIn,(req, res,next) => {
    req.logout(function (err) {
        if (err) {
            next(err);
        }
        req.flash("success", "Loged out successfully");
        res.redirect("/hotels");
    })
})

module.exports = router;