


import productSchema from "../../models/admin/product-schema.js";
import HttpError from "../../models/Http-Error.js";
import authSchema from "../../models/users/auth-schema.js";

export const addToCart = async (req, res, next) => {
  const { userId, quantity, productId } = req.body;

  if (!userId || !productId) {
    return next(new HttpError(400, "Missing userId or productId"));
  }

  let product;
  try {
    product = await productSchema.findById(productId);
    if (!product) {
      return next(new HttpError(404, "Product not found"));
    }
  } catch (error) {
    return next(new HttpError(500, "Error finding product"));
  }

  if (Number(product.stocksQuantity) < Number(quantity)) {
    return next(new HttpError(400, "Stock not available"));
  }

  let user;
  try {
    user = await authSchema.findById(userId);
    if (!user) {
      return next(new HttpError(404, "User not found"));
    }

    
    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      if (Number(product.stocksQuantity) <= Number(existingItem.quantity)) {
         return next(new HttpError(400, `you already add ${existingItem.quantity } not more then ${product.stocksQuantity} available`));
       }
      existingItem.quantity += Number(quantity);
    } else {
      user.cartItems.push({
        productId: productId,
        quantity: Number(quantity),
        image:product.images[0],
        price:product.price,
        title:product.title
      });
    }
   
   

    await user.save();
    return res.status(200).json({ message: "Item added to cart", cart: user.cartItems });

  } catch (error) {
   console.log(error)
    return next(new HttpError(500, "Error updating user cart"));
  }
};
export const increaseQuantity = async (req, res, next) => {
   const { userId, cartItemId } = req.params;
 
   if (!userId || !cartItemId) {
     return next(new HttpError(400, "Missing userId or cartItemId"));
   }
 
   try {
     const user = await authSchema.findById(userId);
     if (!user) {
       return next(new HttpError(404, "User not found"));
     }
 
     const cartItem = user.cartItems.find(
       (item) => item._id.toString() === cartItemId
     );
 
     if (!cartItem) {
       return next(new HttpError(404, "Cart item not found"));
     }
 
     // Optional: Check stock availability again
     const product = await productSchema.findById(cartItem.productId);
     if (!product) {
       return next(new HttpError(404, "Product not found"));
     }
 
     if (cartItem.quantity >= product.stocksQuantity) {
       return next(new HttpError(400, "Stock limit reached"));
     }
 
     cartItem.quantity += 1;
 
     await user.save();
     return res.status(200).json({ message: "Quantity increased", cart: user.cartItems });
   } catch (error) {
     console.log(error);
     return next(new HttpError(500, "Error updating cart quantity"));
   }
 };
 export const descreaseQuantity = async (req, res, next) => {
   const { userId, cartItemId } = req.params;
 
   if (!userId || !cartItemId) {
     return next(new HttpError(400, "Missing userId or cartItemId"));
   }
 
   try {
     const user = await authSchema.findById(userId);
     if (!user) {
       return next(new HttpError(404, "User not found"));
     }
 
     const cartItemIndex = user.cartItems.findIndex(
       (item) => item._id.toString() === cartItemId
     );
 
     if (cartItemIndex === -1) {
       return next(new HttpError(404, "Cart item not found"));
     }
 
     const cartItem = user.cartItems[cartItemIndex];
 
     if (cartItem.quantity > 1) {
       cartItem.quantity -= 1;
     } else {
       // Remove item from cart if quantity becomes 0
       user.cartItems.splice(cartItemIndex, 1);
     }
 
     await user.save();
     return res.status(200).json({ message: "Quantity updated", cart: user.cartItems });
   } catch (error) {
     console.log(error);
     return next(new HttpError(500, "Error removing cart quantity"));
   }
 };
export const removeCartItem = async (req, res, next) => {
  const { userId, cartItemId } = req.params;

  try {
    const user = await authSchema.findById(userId);
    if (!user) return next(new HttpError(404, "User not found"));

    user.cartItems = user.cartItems.filter(
      (item) => item._id.toString() !== cartItemId
    );

    await user.save();
    return res.status(200).json({ message: "Item removed", cart: user.cartItems });
  } catch (err) {
    return next(new HttpError(500, "Failed to delete cart item"));
  }
};
 



export const cartItems = async (req, res, next) => {
   const { userId } = req.params;
 
   try {
     const user = await authSchema.findById(userId);
     if (!user || !user.cartItems || user.cartItems.length === 0) {
       return res.status(200).json({ message: "Cart is empty" });
     }
 
     const updatedCartItems = await Promise.all(
       user.cartItems.map(async (cartItem) => {
         try {
           const product = await productSchema.findById(cartItem.productId);
           
           if (!product || product.stocksQuantity < cartItem.quantity) {
             // Mark unavailable product by setting stocksQuantity to 0
             return {
               ...cartItem.toObject(),
               stocksQuantity: 0,
               available: false,
               note: !product ? "Product no longer available" : "Stock not sufficient",
             };
           }
 
           return {
             ...cartItem.toObject(),
             stocksQuantity: product.stocksQuantity,
             available: true,
           };
         } catch (err) {
           console.error("Error checking product for cart:", err);
           return {
             ...cartItem.toObject(),
             stocksQuantity: 0,
             available: false,
             note: "Error checking product",
           };
         }
       })
     );
 
     return res.status(200).json( updatedCartItems );
   } catch (error) {
     console.error("Cart fetch error:", error);
     return next(new HttpError(400, "Cannot show cart items"));
   }
 };
 