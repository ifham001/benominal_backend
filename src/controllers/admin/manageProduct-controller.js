import {bucket,storage } from '../../config/gcs.js'
import { v4 as uuidv4 } from 'uuid';
import productSchema from '../../models/admin/product-schema.js'
import HttpError from '../../models/Http-Error.js';
import adminSchema from '../../models/admin/admin-schema.js';


export const uploadImges = async (req, res, next) => {
  try {
    const { files } = req;

    if (!files || files.length === 0) {
      return next(new HttpError(400, 'No files uploaded'));
    }

    const imageUrls = [];

    for (const file of files) {
      const blob = bucket.file(`products/${uuidv4()}-${file.originalname}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on('finish', resolve).on('error', reject).end(file.buffer);
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
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


export const deleteImagesFromGCS = async (imageUrls = []) => {
  try {
    for (const imageUrl of imageUrls) {
      const decodedUrl = decodeURIComponent(imageUrl);
      const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;
      
      // Skip if the URL doesn't match the bucket
      if (!decodedUrl.startsWith(baseUrl)) continue;
      
      const filePath = decodedUrl.replace(baseUrl, '');
      await storage.bucket(bucket.name).file(filePath).delete();
      
    }
  } catch (err) {
    
    return next(new HttpError('Failed to delete one or more images from GCS'));
  }
};
export const addProduct = async (req, res, next) => {
  const { title, color, description, price,images,
     stocksQuantity, category } = req.body;

    try {
      const alreadyExists = await productSchema.findOne({ title });
      if (alreadyExists) {
        return next(new HttpError(400, 'Product with this slug already exists'));
      }
    } catch (error) {
      return next(new HttpError(500, 'Database error while checking product existence'));
    }
    let product;
    try {
      product = new productSchema({
        title,
        color,
        description,
        price,
        images,
        stocksQuantity,
        category,
        title
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
        slug: product.slug,
      },
    });
   
      
  }
  export const addStockQuantity = async (req, res, next) => {
    const {productId,stocksQuantity} = req.body
    
    if(!productId || typeof stocksQuantity !== 'number'||stocksQuantity<1){
      return next(new HttpError(400, "input is not valid"))
    }

    let product;
    try {
      product = await productSchema.findById(productId)
      if(!product){
        return next(new HttpError(400,"product didnot exits"))}
    } catch (error) {
      return next(new HttpError(400,"Database error try again"))
    }
    const updatedStockQuantity = product.stocksQuantity +stocksQuantity
    let newUpdatedStockQty;
    try {
      newUpdatedStockQty=  await productSchema.updateOne(
        {_id:productId},{$set:{stocksQuantity:updatedStockQuantity}})
    } catch (error) {
      return next(new HttpError(400,"cannot update stock Quantity"))
    }
    res.status(200).json(newUpdatedStockQty)
  }


export const deleteProduct = async (req, res, next) => {
   const {productId} = req.params
   let productToDelete;
   try {
      productToDelete =  await productSchema.findById(productId)
    if(!productToDelete){
      return next(new HttpError(400,"cannot delete product try again!"))
    }
    // Delete images from GCS
    let images = productToDelete.images;
 
    if (images && images.length > 0) {
      await deleteImagesFromGCS(images);
    }
   
    await productSchema.deleteOne({_id:productId})

    // Remove product ObjectId from admin's products array
    await adminSchema.updateMany(
      {},
      { $pull: { products: productId } }
    );

   } catch (error) {
    return next(new HttpError(400,"something went wrong try again"))
   }
   res.status(200).json("Product delete sucessfully")
}


const allowedCategories = ['rings', 'bracelets', 'necklaces', 'earrings'];

export const showProductsByCategory = async (req, res, next) => {
  const { category } = req.params;

  if (!category) {
    return next(new HttpError(400, 'Category is required'));
  }

  if (!allowedCategories.includes(category)) {
    return next(new HttpError(400, 'Invalid category'));
  }

  try {
    const products = await productSchema.find({ category });

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