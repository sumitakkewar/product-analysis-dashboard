import { Worker } from 'worker_threads';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DataImportService {
  constructor() {
    this.worker = null;
    this.interval = null;
    this.isProcessing = false;
  }

  async importData(filePath) {
    if (this.isProcessing) {
      return { success: false, message: 'Another import is in progress' };
    }

    this.isProcessing = true;

    return new Promise((resolve, reject) => {
      this.worker = new Worker(join(__dirname, '../workers/csvProcessor.js'));

      this.worker.on('message', (result) => {
        this.isProcessing = false;
        resolve(result);
      });

      this.worker.on('error', (error) => {
        this.isProcessing = false;
        reject({ success: false, error: error.message });
      });

      this.worker.on('exit', (code) => {
        if (code !== 0) {
          this.isProcessing = false;
          reject({ success: false, error: `Worker stopped with exit code ${code}` });
        }
      });

      this.worker.postMessage({filePath, batchSize: 100});
    });
  }

  startAutoImport(filePath, intervalMinutes = 60) {
    if (this.interval) {
      return { success: false, message: 'Auto import is already running' };
    }

    const importData = async () => {
      if (!this.isProcessing) {
        try {
          await this.importData(filePath);
          console.log(`Auto import completed at ${new Date().toISOString()}`);
        } catch (error) {
          console.error('Auto import failed:', error);
        }
      }
    };

    // Run immediately
    importData();

    // Then run at specified interval
    this.interval = setInterval(importData, intervalMinutes * 60 * 1000);

    return { success: true, message: `Auto import started with ${intervalMinutes} minute interval` };
  }

  stopAutoImport() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      return { success: true, message: 'Auto import stopped' };
    }
    return { success: false, message: 'No auto import is running' };
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default new DataImportService(); 