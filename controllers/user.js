const asyncCatch = require("../utils/asyncCatchFunction");
const AppError = require("../utils/errorClass");
const { User} = require("../models/user");




module.exports.registerForm = (req, res) => {
    res.render("user/register");
}

module.exports.registerUser =  asyncCatch(async (req, res, next) => {
  try {
    const { email, name, username, password } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      throw new AppError(
        "A user with the given email address is already registered"
      );
    } else {
      const user = new User({ email, name, username });
      const newUser = await User.register(user, password);
      req.login(newUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", "Welcome");
        res.redirect("/hotels");
      });
    }
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
});

module.exports.loginForn = (req, res) => {
  res.render("user/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back");
  const url = res.locals.returnTo || "/hotels";
  res.redirect(url);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      next(err);
    }
    req.flash("success", "Loged out successfully");
    res.redirect("/");
  });
};