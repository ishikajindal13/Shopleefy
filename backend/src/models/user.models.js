import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrpyt from "bcrypt"



const itemSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    description: {
        type: String,
        default: "",
    },
});




const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },
    profilePublicId: {
        type: String
    },
    pets: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",  // References Pet documents for each user
        },
    ],
    favourites: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",  // Stores reference to favorited pets for adoption
        },
    ],
    adoptionApplications: [
        {
        petId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        applicationDate: {
            type: Date,
            default: Date.now,
        },
        },
    ],
    reminders: [
        {
        title: String,
        description: String,
        date: Date,
        isComplete: {
            type: Boolean,
            default: false,
        },
        },
    ],
    communityPosts: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",  // References posts made by the user in the community feed
        },
    ],
    items: [itemSchema],
    bio: {
        type: String,
        maxLength: 500,
    },
    location: {
        type: String,
    },
    following: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // List of users this user is following
        },
    ],
    followers: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // List of users following this user
        },
    ],
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrpyt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrpyt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        },
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        },
    )
}

export const User = mongoose.model("User", userSchema)