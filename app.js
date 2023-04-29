/*----------------------require--------------------------*/
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate")
const { Hotel, validateHotelSchema } = require("./models/hotel");

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
app.use(express.static(path.join(__dirname, "public")))


/*----------------------error class--------------------------*/
class AppError extends Error{
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

/*----------------------async error function--------------------------*/
function asyncError(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

/*----------------------validate hotel middle--------------------------*/

const validateHotel = (req, res, next) => {

    console.log(req.body);
    const { error } = validateHotelSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
}

/*----------------------routes--------------------------*/

app.get("/hotels", asyncError(async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotel/index", { hotels });
    
        
}))

app.get("/hotels/new",  (req, res) => {
    res.render("hotel/new");
})

app.post("/hotels",validateHotel, asyncError(async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    await hotel.save();
    res.redirect(`/hotels`);

}))


app.get("/hotels/:id", asyncError(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if(hotel){
        res.render("hotel/view", { hotel });
    } else {
        throw new AppError("hotel not found", 404);
    }
    
}))

app.get("/hotels/:id/edit", asyncError(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if(hotel){
        res.render("hotel/edit", { hotel });
    } else {
        throw new AppError("hotel not found", 404);
    }
   
}))

app.put("/hotels/:id",validateHotel, asyncError(async(req, res)=> {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id,{...req.body.hotel},{new:true});
    if (hotel) {
        res.redirect(`/hotels/${hotel._id}`);
    }
    else {
        throw new AppError("hotel not found", 404);
    }
}))

app.delete("/hotels/:id", asyncError(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    res.redirect("/hotels");
}))

/*----------------------error handling route--------------------------*/

app.use((err, req, res, next) => {
    if (!(err instanceof AppError)) {
        err.message = "page not found";
        err.status = 404;
    } 
    res.render("error", { err });   
})


/*----------------------listning--------------------------*/
app.listen("3000", () => {
    console.log("listening on port 3000");
})

