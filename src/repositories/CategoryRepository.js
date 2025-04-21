import Category from '../models/Category.js';
import BaseRepository from './BaseRepository.js';

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  // Add any category-specific methods here
  async findActiveCategories() {
    return await this.findAll({
      where: { active: true }
    });
  }

  async getCategoriesWithProducts() {
    return await this.findAll({
      include: ['Product']
    });
  }
}

export default new CategoryRepository(); 