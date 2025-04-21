import dataImportService from '../services/DataImportService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DataImportController {
  async importData(req, res) {
    try {
      const filePath = path.join(__dirname, '../../dump/product.csv');
      await dataImportService.importData(filePath);
      res.status(200).json({ message: 'Data imported successfully' });
    } catch (error) {
      console.error('Error importing data:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new DataImportController(); 