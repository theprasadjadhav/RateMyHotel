const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLogedOut, isLogedIn,storeReturnTo,validateUser } = require("../utils/middlewares");
const userControllers = require("../controllers/user");




router.get("/register", isLogedOut, userControllers.registerForm)

router.post("/register",isLogedOut,validateUser,userControllers.registerUser)

router.get("/login",isLogedOut, userControllers.loginForn)

router.post("/login",isLogedOut,storeReturnTo,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}) , userControllers.loginUser)

router.get("/logout",isLogedIn,userControllers.logoutUser)

module.exports = router;