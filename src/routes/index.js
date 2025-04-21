import { Router } from 'express';
import dataImportController from '../controllers/DataImportController.js';
import fileUploadController, { uploadMiddleware } from '../controllers/FileUploadController.js';
import analysisController from '../controllers/AnalysisController.js';
import { dateValidator } from '../middleware/dateValidator.js';
import { validateProduct } from '../middleware/validateProduct.js';
import { validateCategory } from '../middleware/validateCategory.js';
import { validateRegion } from '../middleware/validateRegion.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth)

// Data import routes
router.post('/import', dataImportController.importData);
// New file upload endpoint
router.post('/import/upload', uploadMiddleware, fileUploadController.uploadAndImport);

// Analysis routes
// Revenue Calculations
router.get('/analysis/revenue/total', dateValidator, analysisController.getTotalRevenue);
router.get('/analysis/revenue/products', dateValidator, validateProduct, analysisController.getRevenueByProduct);
router.get('/analysis/revenue/categories', dateValidator, validateCategory, analysisController.getRevenueByCategory);
router.get('/analysis/revenue/regions', dateValidator, validateRegion, analysisController.getRevenueByRegion);

// Top N Products
router.get('/analysis/products/top', dateValidator, analysisController.getTopProducts);
router.get('/analysis/products/top/category', dateValidator, validateCategory, analysisController.getTopProductsByCategory);
router.get('/analysis/products/top/region', dateValidator, validateRegion, analysisController.getTopProductsByRegion);

// Customer Analysis
router.get('/analysis/customers/count', dateValidator, analysisController.getCustomerCount);
router.get('/analysis/orders/count', dateValidator, analysisController.getOrderCount);
router.get('/analysis/orders/average-value', dateValidator, analysisController.getAverageOrderValue);

// Other Calculations
router.get('/analysis/profit-margin', dateValidator, analysisController.getProfitMarginByProduct);
router.get('/analysis/customer-lifetime-value', dateValidator, analysisController.getCustomerLifetimeValue);
router.get('/analysis/customer-segmentation', dateValidator, analysisController.getCustomerSegmentation);

export default router; 