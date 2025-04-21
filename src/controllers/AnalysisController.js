import analysisService from '../services/AnalysisService.js';

class AnalysisController {
  // Revenue Calculations
  async getTotalRevenue(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await analysisService.getTotalRevenue(startDate, endDate);
      res.json({
        total_revenue: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRevenueByProduct(req, res) {
    try {
      const { startDate, endDate, productId } = req.query;
      const result = await analysisService.getRevenueByProduct(startDate, endDate, productId);
      res.json({
        data: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRevenueByCategory(req, res) {
    try {
      const { startDate, endDate, categoryId } = req.query;
      const result = await analysisService.getRevenueByCategory(startDate, endDate, categoryId);
      res.json({
        data: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRevenueByRegion(req, res) {
    try {
      const { startDate, endDate, regionId } = req.query;
      const result = await analysisService.getRevenueByRegion(startDate, endDate, regionId);
      res.json({
        data: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Top N Products
  async getTopProducts(req, res) {
    try {
      const { startDate, endDate, limit } = req.query;
      const result = await analysisService.getTopProducts(startDate, endDate, parseInt(limit) || 10);
      res.json({
        data: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTopProductsByCategory(req, res) {
    try {
      const { startDate, endDate, limit, categoryId } = req.query;
      const result = await analysisService.getTopProductsByCategory(
        startDate,
        endDate,
        parseInt(categoryId),
        parseInt(limit) || 10
      );
      res.json({
        data: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTopProductsByRegion(req, res) {
    try {
      const { startDate, endDate, limit, regionId } = req.query;
      const result = await analysisService.getTopProductsByRegion(
        startDate,
        endDate,
        parseInt(regionId),
        parseInt(limit) || 10
      );
      res.json({
        data: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Customer Analysis
  async getCustomerCount(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await analysisService.getCustomerCount(startDate, endDate);
      res.json({
        total_customers: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderCount(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await analysisService.getOrderCount(startDate, endDate);
      res.json({
        total_orders: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAverageOrderValue(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await analysisService.getAverageOrderValue(startDate, endDate);
      res.json({
        average_order_value: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Other Calculations
  async getProfitMarginByProduct(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await analysisService.getProfitMarginByProduct(startDate, endDate);

      res.json({
        data: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCustomerLifetimeValue(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await analysisService.getCustomerLifetimeValue(startDate, endDate);
      res.json({
        data: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCustomerSegmentation(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await analysisService.getCustomerSegmentation(startDate, endDate);
      res.json({
        data: result,
        date_range: res.locals.dateRange
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AnalysisController(); 