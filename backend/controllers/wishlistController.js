const User = require("../models/userModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const wishlistController={
// Add Product to Wishlist
    addToWishlist : asyncHandler(async (req, res) => {
    const { id } = req.body;
        const userId=req.user.id
    const user = await User.findById(userId);
    const product = await Product.findById(id);
        if(!product){
            throw new Error("Product not found")
        }
    // Check if product is already in wishlist
    if (user.wishlist.includes(id)) {
        return res.send("Product already in wishlist");
    }

    user.wishlist.push(id);
    await user.save();

    res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
}),

    removeFromWishlist : asyncHandler(async (req, res) => {
    const { id:productId } = req.body;
    const userId=req.user.id
    const user = await User.findById(userId);

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
}),

    getWishlist : asyncHandler(async (req, res) => {
        const userId=req.user.id
    const user = await User.findById(userId).populate("wishlist");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ wishlist: user.wishlist });
})
}

module.exports = wishlistController;
