import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true 
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String 
    },
    category: {
        type: String
    },
    stock: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export const Product = mongoose.model("Product", ProductSchema)