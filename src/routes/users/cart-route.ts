import { Router } from "express";
import { 
  addToCart, 
  increaseQuantity, 
  decreaseQuantity, 
  removeCartItem, 
  cartItems 
} from "../../controllers/users/cart-controller.js";

const userCartRoutes: Router = Router();

// User cart routes
userCartRoutes.post('/add-to-cart', addToCart);
userCartRoutes.get('/cart/:userId', cartItems);
userCartRoutes.put('/cart/increase/:userId/:cartItemId', increaseQuantity);
userCartRoutes.put('/cart/decrease/:userId/:cartItemId', decreaseQuantity);
userCartRoutes.delete('/cart/:userId/:cartItemId', removeCartItem);

export default userCartRoutes; 