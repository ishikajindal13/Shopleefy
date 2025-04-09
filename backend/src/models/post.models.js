import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Tracks users who have liked the post
        },
    ],
    comments: [
        {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);