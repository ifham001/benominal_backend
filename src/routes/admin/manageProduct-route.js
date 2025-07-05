import { Router } from "express";
import checkAuth from '../../middleware/checkAuth.js'

import {addProduct,addStockQuantity,deleteProduct,showProductsByCategory,uploadImges} from '../../controllers/admin/manageProduct-controller.js';
import { uploadMax3Images } from "../../middleware/fileFilter.js";
const  productRouter = Router();

productRouter.post('/upload-images',uploadMax3Images,uploadImges);
productRouter.post('/add-product',checkAuth, addProduct);
productRouter.post('/edit-product',checkAuth,addStockQuantity)
productRouter.get('/delete-product/:productId',checkAuth,deleteProduct)
productRouter.get('/products/:category',checkAuth,showProductsByCategory)
// manageProductRouter.get('/products/:category',showCategoryProductsController)



export default productRouter;