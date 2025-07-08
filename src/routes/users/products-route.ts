import { Router } from "express";
import { 
  showCategoryProductsController, 
  showProductController, 
  showBestProducts 
} from "../../controllers/users/product-controller.js";

const userproductRouter: Router = Router();

// User product routes
userproductRouter.get('/products/best', showBestProducts);
userproductRouter.get('/products/:category', showCategoryProductsController);
userproductRouter.get('/product/:productId', showProductController);

export default userproductRouter; 