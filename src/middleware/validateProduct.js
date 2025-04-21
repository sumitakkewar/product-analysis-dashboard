import { Product } from "../models/index.js";

export const validateProduct = async (req, res, next) => {
    const { productId } = req.query;
  
    // Validate productId if provided
    if (!productId) {
      return res.status(400).json({
        error: 'productId is required'
      });
    }

    // check if product exists
    const product = await Product.findByPk(productId)

    if(!product) {
        return res.status(404).json({
            error: 'Product not found!'
        });
    }
  
    next();
  }; 