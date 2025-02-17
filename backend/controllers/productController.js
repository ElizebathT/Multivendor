const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const productController={
    createProduct : asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, images} = req.body;
    const variations = [];
    const variationKeys = Object.keys(req.body).filter(key => key.startsWith("variations"));

    for (let i = 0; i < variationKeys.length; i++) {
        const variationIndex = variationKeys[i].match(/\d+/)[0]; // Extract index from key name
        if (!variations[variationIndex]) variations[variationIndex] = {}; // Initialize if not already

        const field = variationKeys[i].split('.')[1]; // Get the specific field (size, color, etc.)
        variations[variationIndex][field] = req.body[variationKeys[i]]; // Add value to correct index
    }
    const product = new Product({
        vendor: req.user.id, 
        name,
        description,
        price,
        stock,
        category,
        images:req.file.path,
        variations,
    });
    const createdProduct = await product.save();
    res.send(createdProduct);
}),

    getAllProducts : asyncHandler(async (req, res) => {
    let { category, minPrice, maxPrice, search } = req.body;
    let filter = {};
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (search) filter.name = { $regex: search, $options: "i" };
    const products = await Product.find(filter).populate("vendor", "name email");
    if (products) {
        res.send("Product not found");
    }
    res.send(products);
}),

    updateProduct : asyncHandler(async (req, res) => {
    const {name}=req.body
    const product = await Product.findOne({name,vendor:req.user.id});
    if (!product) {
        throw new Error("Product not found");
    }
    const { description, price, stock, category, images, variations } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.images = images || product.images;
    product.variations = variations || product.variations;
    const updatedProduct = await product.save();
    res.send(updatedProduct);
}),

    deleteProduct : asyncHandler(async (req, res) => {
    const {name}=req.body
    const product = await Product.findOne({name, vendor:req.user.id});
    if (!product) {
        throw new Error("Product not found");
    }
    await product.deleteOne();
    res.send("Product deleted successfully");
})
}
module.exports = productController;
