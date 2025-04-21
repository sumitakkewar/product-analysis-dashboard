import { parentPort } from 'worker_threads';
import { sequelize } from '../config/database.js';
import csvParserService from '../services/CSVParserService.js';
import recordProcessorService from '../services/RecordProcessorService.js';

class CSVProcessor {
  constructor() {
    this.csvParser = csvParserService;
    this.recordProcessor = recordProcessorService;
    this.maxConcurrentBatches = 5; // Maximum number of batches to process concurrently
    this.activeBatches = 0;
  }

  async processCSV(filePath, batchSize = 1000) {
    const failedRecords = [];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const failedRecordsPath = `temp/failed_records_${timestamp}.csv`;
    const batchPromises = [];

    try {
      const processBatch = async (batch, processedCount) => {
        // Wait if we've reached the maximum concurrent batches
        while (this.activeBatches >= this.maxConcurrentBatches) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.activeBatches++;
        
        try {
          // Create a new transaction for each batch
          const transaction = await sequelize.transaction();
          
          try {
            for (const record of batch) {
              try {
                this.recordProcessor.validateRecord(record);
                await this.recordProcessor.processRecord(record, transaction);
              } catch (error) {
                console.log('error', error);
                failedRecords.push({
                  ...record,
                  error_message: error.message,
                  timestamp: new Date().toISOString()
                });
              }
            }
            
            // Commit the transaction for this batch
            await transaction.commit();
            
            parentPort.postMessage({ 
              type: 'progress', 
              processed: processedCount,
              status: 'processing',
              activeBatches: this.activeBatches
            });
          } catch (error) {
            // Rollback the transaction if any error occurs
            await transaction.rollback();
            throw error;
          } finally {
            this.activeBatches--;
          }
        } catch (error) {
          console.error('Batch processing error:', error);
          this.activeBatches--;
          throw error;
        }
      };

      const processedCount = await this.csvParser.processCSVInBatches(
        filePath,
        batchSize,
        processBatch
      );

      // Wait for all batch promises to complete
      await Promise.all(batchPromises);

      await this.csvParser.writeFailedRecords(failedRecords, failedRecordsPath);

      return { 
        success: true, 
        message: 'Data imported successfully',
        processedCount,
        failedRecords: {
          count: failedRecords.length,
          filePath: failedRecords.length > 0 ? failedRecordsPath : null
        }
      };
    } catch (error) {
      console.log('error', error);
      return { 
        success: false, 
        error: error.message,
        failedRecords: {
          count: failedRecords.length,
          filePath: failedRecords.length > 0 ? failedRecordsPath : null
        }
      };
    }
  }
}

const csvProcessor = new CSVProcessor();

parentPort.on('message', async (message) => {
  try {
    const { filePath, batchSize } = message;
    console.log('Processing file:', filePath);
    const result = await csvProcessor.processCSV(filePath, batchSize);
    parentPort.postMessage(result);
  } catch (error) {
    console.log('error', error);
    parentPort.postMessage({ success: false, error: error.message });
  }
}); 