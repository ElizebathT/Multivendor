const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const Vendor = require("../models/vendorModel");

const productController = {
    createProduct: asyncHandler(async (req, res) => {
        const {
            name, description, category, price, stock, 
            minQuantity, discountedPrice, color, size
        } = req.body;

        const images = req.files ? req.files.map(file => file.path) : [];

        const product = new Product({
            vendor:req.user.id,
            name,
            description,
            category,
            images,
            price,
            stock,
            minQuantity,
            discountedPrice,
            color,
            size
        });

        const savedProduct = await product.save();

        // Update Vendor's product list
        const vendorData = await Vendor.findOne({user:req.user.id});
        if (vendorData) {
            vendorData.products.push(savedProduct._id);
            await vendorData.save();
        }

        res.status(201).json(savedProduct);
    }),

    getAllProducts: asyncHandler(async (req, res) => {
        const products = await Product.find().populate("vendor", "name");
        res.json(products);
    }),

    getProductById: asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id).populate("vendor review");

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    }),

    searchProducts: asyncHandler(async (req, res) => {
        const { query } = req.body;        
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        });
        res.json(products);
    }),

    updateProduct: asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            if (req.files) {
                product.images = req.files.map(file => file.path);
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    }),

    deleteProduct: asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Vendor.findByIdAndUpdate(product.vendor, {
                $pull: { products: product._id }
            });

            await product.deleteOne();
            res.json({ message: "Product deleted successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    })
};

module.exports = productController;
