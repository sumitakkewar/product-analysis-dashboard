import BaseRepository from './BaseRepository.js';
import { Product, Order, Category } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from 'sequelize';

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  // Add any product-specific methods here
  async findActiveProducts() {
    return await this.findAll({
      where: { active: true }
    });
  }

  async findByCategory(categoryId) {
    return await this.findAll({
      where: { category_id: categoryId }
    });
  }

  async getProductSalesMetrics(startDate, endDate) {
    const where = this.getDateRange(startDate, endDate);
    return this.findAll({
      attributes: [
        'id',
        'name',
        'price',
        [sequelize.fn('SUM', sequelize.col('Orders.quantity')), 'total_quantity_sold'],
        [sequelize.fn('SUM', sequelize.literal('Orders.quantity * Orders.unit_price')), 'total_revenue'],
        [sequelize.fn('AVG', sequelize.col('Orders.unit_price')), 'average_selling_price'],
        [sequelize.fn('COUNT', sequelize.col('Orders.id')), 'number_of_orders']
      ],
      include: [{
        model: Order,
        attributes: [],
        where
      }],
      group: ['Product.id'],
      order: [[sequelize.literal('total_quantity_sold'), 'DESC']]
    });
  }

  async getProductPriceTrends(startDate, endDate) {
    const where = this.getDateRange(startDate, endDate);
    return this.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('DATE', sequelize.col('Orders.date_of_sales')), 'sale_date'],
        [sequelize.fn('AVG', sequelize.col('Orders.unit_price')), 'average_price'],
        [sequelize.fn('SUM', sequelize.col('Orders.quantity')), 'total_quantity']
      ],
      include: [{
        model: Order,
        attributes: [],
        where
      }],
      group: ['Product.id', sequelize.fn('DATE', sequelize.col('Orders.date_of_sales'))],
      order: [
        ['id', 'ASC'],
        [sequelize.fn('DATE', sequelize.col('Orders.date_of_sales')), 'ASC']
      ]
    });
  }

  async getProductPerformanceByCategory(startDate, endDate) {
    const where = this.getDateRange(startDate, endDate);
    return this.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('SUM', sequelize.col('Orders.quantity')), 'total_quantity_sold'],
        [sequelize.fn('SUM', sequelize.literal('Orders.quantity * Orders.unit_price')), 'total_revenue'],
        [sequelize.fn('AVG', sequelize.col('Orders.unit_price')), 'average_selling_price']
      ],
      include: [
        {
          model: Order,
          attributes: [],
          where
        },
        {
          model: Category,
          attributes: ['name']
        }
      ],
      group: ['Product.id', 'Category.id'],
      order: [[sequelize.literal('total_revenue'), 'DESC']]
    });
  }

  async getProductInventoryMetrics() {
    return this.findAll({
      attributes: [
        'id',
        'name',
        'price',
        'stock_quantity',
        [sequelize.literal('price * stock_quantity'), 'inventory_value'],
        [sequelize.literal('CASE WHEN stock_quantity < 10 THEN "Low" WHEN stock_quantity < 50 THEN "Medium" ELSE "High" END'), 'stock_level']
      ],
      order: [['inventory_value', 'DESC']]
    });
  }

  async getProductDiscountAnalysis(startDate, endDate) {
    const where = this.getDateRange(startDate, endDate);
    return this.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('AVG', sequelize.col('Orders.discount')), 'average_discount'],
        [sequelize.fn('SUM', sequelize.literal('Orders.quantity * Orders.discount')), 'total_discount_amount'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN Orders.discount > 0 THEN 1 END')), 'discounted_orders_count']
      ],
      include: [{
        model: Order,
        attributes: [],
        where
      }],
      group: ['Product.id'],
      order: [[sequelize.literal('total_discount_amount'), 'DESC']]
    });
  }

  async getProductProfitability(startDate, endDate) {
    const where = this.getDateRange(startDate, endDate);
    return this.findAll({
      attributes: [
        'id',
        'name',
        'cost_price',
        [sequelize.fn('SUM', sequelize.col('Orders.quantity')), 'total_quantity_sold'],
        [sequelize.fn('SUM', sequelize.literal('Orders.quantity * Orders.unit_price')), 'total_revenue'],
        [sequelize.fn('SUM', sequelize.literal('Orders.quantity * cost_price')), 'total_cost'],
        [sequelize.literal('(SUM(Orders.quantity * Orders.unit_price) - SUM(Orders.quantity * cost_price)) / SUM(Orders.quantity * Orders.unit_price) * 100'), 'profit_margin_percentage']
      ],
      include: [{
        model: Order,
        attributes: [],
        where
      }],
      group: ['Product.id'],
      order: [[sequelize.literal('profit_margin_percentage'), 'DESC']]
    });
  }
}

export default new ProductRepository(); 