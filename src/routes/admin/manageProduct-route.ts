import { Router } from "express";
import { uploadMax3Images } from "../../middleware/fileFilter.js";
import { 
  uploadImges, 
  addProduct, 
  addStockQuantity, 
  deleteProduct, 
  showProductsByCategory 
} from "../../controllers/admin/manageProduct-controller.js";

const manageProductRouter: Router = Router();

// Image upload route
manageProductRouter.post('/upload-images', uploadMax3Images, uploadImges);

// Product management routes
manageProductRouter.post('/add-product', addProduct);
manageProductRouter.post('/add-stock', addStockQuantity);
manageProductRouter.delete('/delete-product/:productId', deleteProduct);
manageProductRouter.get('/products/:category', showProductsByCategory);

export default manageProductRouter; 