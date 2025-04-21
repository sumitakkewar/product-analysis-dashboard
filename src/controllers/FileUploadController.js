import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dataImportService from '../services/DataImportService.js';
import { unlinkSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

class FileUploadController {
  async uploadAndImport(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = req.file.path;
      
      // Reuse the existing import logic
      await dataImportService.importData(filePath);

      await unlinkSync(filePath)

      res.status(200).json({
        message: 'File uploaded and data imported successfully',
        file: req.file.filename
      });
    } catch (error) {
      console.error('Error in file upload and import:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const uploadMiddleware = upload.single('file');
export default new FileUploadController(); 