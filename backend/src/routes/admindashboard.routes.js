import { Router } from "express";
import { Product } from "../models/product.models.js"
import { upload } from "../middlewares/multer.middleware.js"
const router = Router();

// POST: Add a new product
router.post("/products", upload.single('imageUrl'), async (req, res) => {

    try {

        console.log(req.headers);
        
        console.log(req.body);
        console.log(req.file);


        const { name, price, description, category, stock } = req.body;
        const product = new Product({
            name,
            price,
            description,
            category,
            stock,
            imageUrl: req.file?.path || null,
        });
        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Failed to add product", error });
    }
});

export default router;