import { Request, Response, NextFunction } from 'express';
import productSchema from '../../models/admin/product-schema.js';
import HttpError from '../../models/Http-Error.js';
import { IProduct } from '../../types/admin.types.js';

interface CategoryRequest extends Request {
  params: {
    category: string;
  };
}

interface ProductIdRequest extends Request {
  params: {
    productId: string;
  };
}

const allowedCategories: string[] = ['rings', 'bracelets', 'necklaces', 'earrings'];

export const showCategoryProductsController = async (req: CategoryRequest, res: Response, next: NextFunction): Promise<void> => {
  const { category } = req.params;
  

  if (!category) {
    return next(new HttpError(400, 'Category is required'));
  }

  if (!allowedCategories.includes(category)) {
    return next(new HttpError(400, 'Invalid category'));
  }

  try {
    // Show all products but sort by highest stock quantity first (in-stock items appear first)
    const products: IProduct[] = await productSchema
      .find({ category })
      .sort({ stocksQuantity: -1 }); // Sort by highest stock quantity first

    if (products.length === 0) {
      return next(new HttpError(404, 'No products found for this category'));
    }

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.error(error);
    return next(new HttpError(500, 'Failed to retrieve products'));
  }
};

export const showProductController = async (req: ProductIdRequest, res: Response, next: NextFunction): Promise<void> => {
  const { productId } = req.params;

  if (!productId) {
    return next(new HttpError(400, 'Product ID is required'));
  }

  try {
    // Find product (show even if out of stock)
    const product: IProduct | null = await productSchema.findById(productId);  
    if (!product) {
      return next(new HttpError(404, 'Product not found'));
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    return next(new HttpError(500, 'Failed to retrieve product'));
  }
};

export const showBestProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  const categories: string[] = ['bracelets', 'necklaces', 'rings', 'earrings'];
  const bestProducts: IProduct[] = [];

  try {
    for (const category of categories) {
      // Get all products but sort by highest stock quantity first (in-stock items appear first)
      const products: IProduct[] = await productSchema
        .find({ category })
        .sort({ stocksQuantity: -1 }) // Sort by highest stock quantity first
        .limit(2); // Get only 2 products per category
      
      bestProducts.push(...products);
    }

    // Sort all best products by stock quantity (highest first)
    bestProducts.sort((a, b) => b.stocksQuantity - a.stocksQuantity);

    res.status(200).json({ bestProducts });
  } catch (error) {
    return next(new HttpError(500, "Fetching best products failed."));
  }
}; 