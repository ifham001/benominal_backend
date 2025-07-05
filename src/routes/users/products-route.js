import {Router}from 'express';
import { showCategoryProductsController, showProductController,showBestProducts } from '../../controllers/users/product-controller.js';

let userproductRouter = Router();

userproductRouter.get('/collection/:category', showCategoryProductsController);
userproductRouter.get('/products/:productId', showProductController);
userproductRouter.get('/best-products',showBestProducts)

export default userproductRouter;