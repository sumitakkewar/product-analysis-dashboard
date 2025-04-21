import Order from '../models/Order.js';
import BaseRepository from './BaseRepository.js';
import { sequelize } from '../config/database.js';

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  // Add any order-specific methods here
  async findByCustomer(customerId) {
    return await sequelize.query(
      `SELECT o.*, p.*, c.*, pm.*, r.* 
       FROM "order" o
       LEFT JOIN "product" p ON o.product_id = p.id
       LEFT JOIN "customer" c ON o.customer_id = c.id
       LEFT JOIN "payment_method" pm ON o.payment_method_id = pm.id
       LEFT JOIN "region" r ON o.region_id = r.id
       WHERE o.customer_id = :customerId`,
      {
        replacements: { customerId },
        type: sequelize.QueryTypes.SELECT,
        model: Order,
        mapToModel: true
      }
    );
  }

  async findByDateRange(startDate, endDate) {
    return await sequelize.query(
      `SELECT o.*, p.*, c.*, pm.*, r.* 
       FROM "order" o
       LEFT JOIN "product" p ON o.product_id = p.id
       LEFT JOIN "customer" c ON o.customer_id = c.id
       LEFT JOIN "payment_method" pm ON o.payment_method_id = pm.id
       LEFT JOIN "region" r ON o.region_id = r.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
        model: Order,
        mapToModel: true
      }
    );
  }

  async getSalesByRegion(regionId) {
    return await sequelize.query(
      `SELECT o.*, p.*, c.*, pm.*, r.* 
       FROM "order" o
       LEFT JOIN "product" p ON o.product_id = p.id
       LEFT JOIN "customer" c ON o.customer_id = c.id
       LEFT JOIN "payment_method" pm ON o.payment_method_id = pm.id
       LEFT JOIN "region" r ON o.region_id = r.id
       WHERE o.region_id = :regionId`,
      {
        replacements: { regionId },
        type: sequelize.QueryTypes.SELECT,
        model: Order,
        mapToModel: true
      }
    );
  }

  async getTotalRevenue(startDate, endDate) {
    const result = await sequelize.query(
      `SELECT COALESCE(SUM(total_cost), 0) as total_revenue
       FROM "order"
       WHERE date_of_sales BETWEEN :startDate AND :endDate`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );
    return result[0].total_revenue;
  }

  async getRevenueByProduct(startDate, endDate, productId) {
    return await sequelize.query(
      `SELECT 
         p.name as product,
         COALESCE(SUM(o.total_cost), 0) as total_revenue
       FROM "order" o
       JOIN "product" p ON o.product_id = p.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate AND o.product_id = :productId
       GROUP BY p.id
       ORDER BY total_revenue DESC`,
      {
        replacements: { startDate, endDate, productId },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  async getRevenueByCategory(startDate, endDate, categoryId) {
    return await sequelize.query(
      `SELECT 
         c.name as category,
         COALESCE(SUM(o.total_cost), 0) as total_revenue
       FROM "order" o
       LEFT JOIN "product" p ON o.product_id = p.id
       LEFT JOIN "category" c ON p.category_id = c.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate AND p.category_id = :categoryId
       GROUP BY c.id
       ORDER BY total_revenue DESC`,
      {
        replacements: { startDate, endDate, categoryId },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  async getRevenueByRegion(startDate, endDate, regionId) {
    return await sequelize.query(
      `SELECT 
         r.name,
         COALESCE(SUM(o.total_cost), 0) as total_revenue
       FROM "order" o
       LEFT JOIN "region" r ON o.region_id = r.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate AND o.region_id = :regionId 
       GROUP BY r.id
       ORDER BY total_revenue DESC`,
      {
        replacements: { startDate, endDate, regionId },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  async getTopProducts(startDate, endDate, limit = 10) {
    return await sequelize.query(
      `SELECT 
         p.name as product,
         SUM(o.quantity) as quantity,
         COALESCE(SUM(o.total_cost), 0) as total_revenue
       FROM "order" o
       LEFT JOIN "product" p ON o.product_id = p.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate
       GROUP BY p.id
       ORDER BY quantity DESC
       LIMIT :limit`,
      {
        replacements: { startDate, endDate, limit },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  async getTopProductsByCategory(startDate, endDate, categoryId, limit = 10) {
    return await sequelize.query(
      `SELECT 
         c.name as category,
         p.name as product,
         SUM(o.quantity) as quantity,
         COALESCE(SUM(o.total_cost), 0) as total_revenue
       FROM "order" o
       LEFT JOIN "product" p ON o.product_id = p.id
       LEFT JOIN "category" c ON p.category_id = c.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate
       AND p.category_id = :categoryId
       GROUP BY p.id, c.id
       ORDER BY quantity DESC
       LIMIT :limit`,
      {
        replacements: { startDate, endDate, categoryId, limit },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  async getTopProductsByRegion(startDate, endDate, regionId, limit = 10) {
    return await sequelize.query(
      `SELECT 
         r.name as region,
         p.name as product,
         SUM(o.quantity) as quantity,
         COALESCE(SUM(o.total_cost), 0) as total_revenue
       FROM "order" o
       JOIN "region" r ON o.region_id = r.id
       JOIN "product" p ON o.product_id = p.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate AND r.id = :regionId
       GROUP BY r.id, p.id
       ORDER BY quantity DESC
       LIMIT :limit`,
      {
        replacements: { startDate, endDate, regionId, limit },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  async getProfitMarginByProduct(startDate, endDate) {
    return await sequelize.query(
      `SELECT 
         p.name,
         (((SUM(o.total_cost) - SUM(o.actual_cost)) / SUM(o.total_cost)) * 100)::NUMERIC(10, 2) as profit_margin
       FROM "order" o
       LEFT JOIN "product" p ON o.product_id = p.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate
       GROUP BY p.id`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  async getCustomerLifetimeValue(startDate, endDate) {
    return await sequelize.query(
      `SELECT 
         c.name,
         c.email,
         SUM(o.total_cost) as total_value,
         COUNT(o.id) as order_count
       FROM "order" o
       LEFT JOIN "customer" c ON o.customer_id = c.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate
       GROUP BY c.id`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  async getCustomerSegmentation(startDate, endDate) {
    const result = await sequelize.query(
      `SELECT 
         c.name,
         c.email,
         SUM(o.total_cost) as total_spent,
         COUNT(o.id) as order_count
       FROM "order" o
       LEFT JOIN "customer" c ON o.customer_id = c.id
       WHERE o.date_of_sales BETWEEN :startDate AND :endDate
       GROUP BY c.id, c.name, c.email`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    return result.map(customer => {
      const totalSpent = customer.total_spent;
      const orderCount = customer.order_count;
      
      let segment = 'Low Value';
      if (totalSpent > 1000 && orderCount > 5) {
        segment = 'High Value';
      } else if (totalSpent > 500 || orderCount > 3) {
        segment = 'Medium Value';
      }

      return {
        ...customer,
        segment
      };
    });
  }

  async getCustomerCount(startDate, endDate) {
    const result = await sequelize.query(
      `SELECT COUNT(DISTINCT customer_id) as total_customers
       FROM "order"
       WHERE date_of_sales BETWEEN :startDate AND :endDate`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );
    return result[0].total_customers || 0;
  }

  async getOrderCount(startDate, endDate) {
    const result = await sequelize.query(
      `SELECT COUNT(*) as total_orders
       FROM "order"
       WHERE date_of_sales BETWEEN :startDate AND :endDate`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );
    return result[0].total_orders || 0;
  }

  async getAverageOrderValue(startDate, endDate) {
    const result = await sequelize.query(
      `SELECT COALESCE(AVG(total_cost), 0) as average_value
       FROM "order"
       WHERE date_of_sales BETWEEN :startDate AND :endDate`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );
    return result[0].average_value || 0;
  }
}

export default new OrderRepository(); 