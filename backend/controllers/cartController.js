const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Notification = require("../models/notificationModel");

const cartController={
    addToCart : asyncHandler(async (req, res) => {
        const { id, quantity } = req.body;
        const userId = req.user.id;
      
        // Find or create the user's cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
          cart = new Cart({ user: userId, items: [], totalAmount: 0 });
        }
        const product = await Product.findById(id );
        if (!product) {
          return res.status(404).json({ message: "Item not found" });
        }
        if(!product.availability){
          throw new Error("Item not available. Sorry for the inconvenience")
        }
        const productId = product._id.toString();
      
        // Check if item is already in the cart
        const itemIndex = cart.items.findIndex(
          (item) => item?.product?.toString() === productId
      );
      
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({ product: productId, quantity });
        }
      
        cart.totalAmount = cart.totalAmount + quantity * product.price
      
        // Save the updated cart
        const completed=await cart.save();
        if(!completed)
        {
          res.send('Error in adding to cart')
        }
        const notification = new Notification({
          user: userId,
          message: `You have added ${quantity} ${product.name}(s) to your cart.`
      });
      await notification.save();
        res.send(cart);
      }),

    getCart : asyncHandler(async (req, res) => {    
        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
        if (!cart) return res.json({ items: [] });
        res.json(cart);
        res.status(500).json({ error: error.message });    
    }),

    removeFromCart:asyncHandler(async (req, res) => {
        const { name } = req.body;
        const userId = req.user.id;
      
        let cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) res.send("Cart not found");
      
        const product = await product.findOne({ name });
        if (!product) return res.send("Menu item not found");
      
        const productId = product._id.toString(); 
      
        cart.items = cart.items.filter((item) => item.product._id.toString() !== productId);
      
        cart.totalAmount = cart.items.reduce((total, item) => {
          return total + item.quantity * item.product.price;
        }, 0);
      
        const updatedCart = await cart.save();
        if (!updatedCart) {
          return res.send("Failed to remove from cart");
        }      
        res.send("Item Removed!");
      }),

    clearCart :asyncHandler(async (req, res) => {  
    const completed=await Cart.findOneAndDelete({ user: req.user.id });
    if(!completed){
        res.send("Failed to delete Cart");  
    }
    res.send("Cart cleared");  
    
    })
}
module.exports=cartController