import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true,  // e.g., Dog, Cat, etc.
    },
    breed: {
        type: String,
    },
    age: {
        type: Number,  // Age in years
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,  // URL of the pet's image
    },
    adoptionStatus: {
        type: String,
        enum: ["available", "adopted", "fostered"],
        default: "available",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User who owns this pet
    },
    likes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Users who liked this pet
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("Pet", petSchema);