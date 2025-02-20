const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const Vendor = require("../models/vendorModel");

const productController = {
    createProduct: asyncHandler(async (req, res) => {
        const { vendor, name, description, category, images, price, stock, bulkDiscounts, variations } = req.body;
        const product = new Product({
            vendor,
            name,
            description,
            category,
            images,
            price,
            stock,
            bulkDiscounts,
            variations
        });
        const savedProduct = await product.save();
        const vendorData = await Vendor.findById(vendor);
        if (vendorData) {
            vendorData.products.push(savedProduct._id);
            await vendorData.save();
        }
        res.send(savedProduct);
    }),

    getAllProducts: asyncHandler(async (req, res) => {
        const products = await Product.find();
        res.send(products);
    }),

    getProductById: asyncHandler(async (req, res) => {
        const { query } = req.body;
        
        if (!query) {
            throw new Error("Search query is required");
        }
        
        const vendors = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        })
        
        res.send(vendors);
    }),

    updateProduct: asyncHandler(async (req, res) => {
        const {id}=req.body
        const product = await Product.findById(id);
        
        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.send(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    }),

    deleteProduct: asyncHandler(async (req, res) => {
        const {id}=req.body
        const product = await Product.findById(id);
        
        if (product) {
            await product.deleteOne();
            res.send({ message: "Product deleted successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    })
};

module.exports = productController;
