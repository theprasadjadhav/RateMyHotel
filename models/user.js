const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const joi = require("joi");


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true,"Email is required"],
        unique: [true, "Already registerd with this email"]
    }
})

userSchema.plugin(passportLocalMongoose);

const validateUserSchema = joi.object({ 
        email:joi.string().required(),
        username: joi.string().alphanum().min(3).max(30).required(),
        password:joi.string().required()
})



module.exports.User = mongoose.model("User", userSchema);
module.exports.validateUserSchema = validateUserSchema;