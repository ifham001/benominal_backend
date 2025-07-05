import { Router } from "express";
import { addToCart, cartItems, removeCartItem, increaseQuantity, descreaseQuantity } from "../../controllers/users/cart-controller.js";
import checkAuth from "../../middleware/checkAuth.js";


const userCartRoutes = Router();

// Apply checkAuth to routes that need authentication
userCartRoutes.post('/add-to-cart', checkAuth, addToCart);
userCartRoutes.get('/cart/:userId', checkAuth, cartItems);
userCartRoutes.delete('/cart/:userId/:cartItemId', checkAuth, removeCartItem);
userCartRoutes.get('/cart/:userId/:cartItemId/increase', checkAuth, increaseQuantity);
userCartRoutes.get('/cart/:userId/:cartItemId/decrease', checkAuth, descreaseQuantity);

export default userCartRoutes;
