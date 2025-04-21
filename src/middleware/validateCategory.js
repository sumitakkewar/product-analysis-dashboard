import { Category } from "../models/index.js";

export const validateCategory = async (req, res, next) => {
    const { categoryId } = req.query;
  
    // Validate categoryId if provided
    if (!categoryId) {
      return res.status(400).json({
        error: 'categoryId is required'
      });
    }

    // check if category exists
    const category = await Category.findByPk(categoryId)

    if(!category) {
        return res.status(404).json({
            error: 'Category not found!'
        });
    }
  
    next();
  }; 