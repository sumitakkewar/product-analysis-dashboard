import { Order, Product, Customer, Category, Region } from '../models/index.js';
import { Op } from 'sequelize';
import orderRepository from '../repositories/OrderRepository.js';
import productRepository from '../repositories/ProductRepository.js';

class AnalysisService {
  // Helper method to get date range
  getDateRange(startDate, endDate) {
    return {
      date_of_sales: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    };
  }

  // Revenue Calculations
  async getTotalRevenue(startDate, endDate) {
    return orderRepository.getTotalRevenue(startDate, endDate);
  }

  async getRevenueByProduct(startDate, endDate, productId) {
    return orderRepository.getRevenueByProduct(startDate, endDate, productId);
  }

  async getRevenueByCategory(startDate, endDate, categoryId) {
    return orderRepository.getRevenueByCategory(startDate, endDate, categoryId);
  }

  async getRevenueByRegion(startDate, endDate, regionId) {
    return orderRepository.getRevenueByRegion(startDate, endDate, regionId);
  }

  // Top N Products
  async getTopProducts(startDate, endDate, limit = 10) {
    return orderRepository.getTopProducts(startDate, endDate, limit);
  }

  async getTopProductsByCategory(startDate, endDate, categoryId, limit = 10) {
    return orderRepository.getTopProductsByCategory(startDate, endDate, categoryId, limit);
  }

  async getTopProductsByRegion(startDate, endDate, regionId, limit = 10) {
    return orderRepository.getTopProductsByRegion(startDate, endDate, regionId, limit);
  }

  // Customer Analysis
  async getCustomerCount(startDate, endDate) {
    return orderRepository.getCustomerCount(startDate, endDate);
  }

  async getOrderCount(startDate, endDate) {
    return orderRepository.getOrderCount(startDate, endDate);
  }

  async getAverageOrderValue(startDate, endDate) {
    return orderRepository.getAverageOrderValue(startDate, endDate);
  }

  // Other Calculations
  async getProfitMarginByProduct(startDate, endDate) {
    return orderRepository.getProfitMarginByProduct(startDate, endDate);
  }

  async getCustomerLifetimeValue(startDate, endDate) {
    return orderRepository.getCustomerLifetimeValue(startDate, endDate);
  }

  async getCustomerSegmentation(startDate, endDate) {
    return orderRepository.getCustomerSegmentation(startDate, endDate);
  }
}

export default new AnalysisService(); 