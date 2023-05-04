module.exports.isLogedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Login required");
        res.redirect("/login");
    } else {
        next();
    }
}

module.exports.isLogedOut = function (req, res, next) {
    if (req.isAuthenticated()) {
        req.flash("error", "Already loged in")
        res.redirect("/hotels");
    } else {
        next();
    }
}

module.exports.storeReturnTo = function (req, res, next) {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;        
    }
    next();
}