import { Request, Response, NextFunction } from 'express';
import { bucket, storage } from '../../config/gcs.js';
import { v4 as uuidv4 } from 'uuid';
import productSchema from '../../models/admin/product-schema.js';
import HttpError from '../../models/Http-Error.js';
import adminSchema from '../../models/admin/admin-schema.js';
import { IProduct } from '../../types/admin.types.js';



interface AddProductRequest extends Request {
  body: {
    title: string;
    color: string;
    description: string;
    price: number;
    images: string[];
    stocksQuantity: number;
    category: 'rings' | 'bracelets' | 'necklaces' | 'earrings';
  };
}

interface AddStockRequest extends Request {
  body: {
    productId: string;
    stocksQuantity: number;
  };
}

interface DeleteProductRequest extends Request {
  params: {
    productId: string;
  };
}

interface CategoryRequest extends Request {
  params: {
    category: string;
  };
}

export const uploadImges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new HttpError(400, 'No files uploaded'));
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      const blob = bucket.file(`products/${uuidv4()}-${file.originalname}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });

      await new Promise<void>((resolve, reject) => {
        blobStream.on('finish', resolve).on('error', reject).end(file.buffer);
      });

      const publicUrl: string = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      imageUrls.push(publicUrl);
    }

    res.status(200).json({
      message: 'Images uploaded successfully to GCS',
      urls: imageUrls,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, 'Failed to upload images'));
  }
};

export const deleteImagesFromGCS = async (imageUrls: string[] = []): Promise<void> => {
  try {
    for (const imageUrl of imageUrls) {
      const decodedUrl: string = decodeURIComponent(imageUrl);
      const baseUrl: string = `https://storage.googleapis.com/${bucket.name}/`;
      
      // Skip if the URL doesn't match the bucket
      if (!decodedUrl.startsWith(baseUrl)) continue;
      
      const filePath: string = decodedUrl.replace(baseUrl, '');
      await storage.bucket(bucket.name).file(filePath).delete();
    }
  } catch (err) {
    console.error('Failed to delete images from GCS:', err);
    throw new HttpError(500, 'Failed to delete one or more images from GCS');
  }
};

export const addProduct = async (req: AddProductRequest, res: Response, next: NextFunction): Promise<void> => {
  const { title, color, description, price, images, stocksQuantity, category } = req.body;

  try {
    const alreadyExists: IProduct | null = await productSchema.findOne({ title });
    if (alreadyExists) {
      return next(new HttpError(400, 'Product with this title already exists'));
    }
  } catch (error) {
    return next(new HttpError(500, 'Database error while checking product existence'));
  }

  let product: IProduct;
  try {
    product = new productSchema({
      title,
      color,
      description,
      price,
      images,
      stocksQuantity,
      category,
    });

    await product.save();
    
    // Add product ObjectId to admin's products array
    await adminSchema.updateMany(
      {},
      { $push: { products: product._id } }
    );
  } catch (error) {
    return next(new HttpError(500, 'Failed to save product'));
  }

  res.status(201).json({
    message: 'Product added successfully',
    product: {
      id: product._id,
      title: product.title,
      color: product.color,
      description: product.description,
      price: product.price,
      images: product.images,
      stocksQuantity: product.stocksQuantity,
      category: product.category,
    },
  });
};

export const addStockQuantity = async (req: AddStockRequest, res: Response, next: NextFunction): Promise<void> => {
  const { productId, stocksQuantity } = req.body;
  
  if (!productId || typeof stocksQuantity !== 'number' || stocksQuantity < 1) {
    return next(new HttpError(400, "Input is not valid"));
  }

  let product: IProduct | null;
  try {
    product = await productSchema.findById(productId);
    if (!product) {
      return next(new HttpError(400, "Product does not exist"));
    }
  } catch (error) {
    return next(new HttpError(400, "Database error, try again"));
  }

  const updatedStockQuantity: number = product.stocksQuantity + stocksQuantity;
  
  try {
    const newUpdatedStockQty = await productSchema.updateOne(
      { _id: productId }, 
      { $set: { stocksQuantity: updatedStockQuantity } }
    );
    res.status(200).json({
      success: true,
      message: "Stock quantity updated successfully.",
      newUpdatedStockQty
    });
  } catch (error) {
    return next(new HttpError(400, "Cannot update stock quantity"));
  }
};

export const deleteProduct = async (req: DeleteProductRequest, res: Response, next: NextFunction): Promise<void> => {
  const { productId } = req.params;
  
  try {
    const productToDelete: IProduct | null = await productSchema.findById(productId);
    if (!productToDelete) {
      return next(new HttpError(400, "Cannot delete product, try again!"));
    }

    // Delete images from GCS
    const images: string[] = productToDelete.images;
    if (images && images.length > 0) {
      await deleteImagesFromGCS(images);
    }
   
    await productSchema.deleteOne({ _id: productId });

    // Remove product ObjectId from admin's products array
    await adminSchema.updateMany(
      {},
      { $pull: { products: productId } }
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(new HttpError(400, "Something went wrong, try again"));
  }
};

const allowedCategories: string[] = ['rings', 'bracelets', 'necklaces', 'earrings'];

export const showProductsByCategory = async (req: CategoryRequest, res: Response, next: NextFunction): Promise<void> => {
  const { category } = req.params;

  if (!category) {
    return next(new HttpError(400, 'Category is required'));
  }

  if (!allowedCategories.includes(category)) {
    return next(new HttpError(400, 'Invalid category'));
  }

  try {
    const products: IProduct[] = await productSchema.find({ category });

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