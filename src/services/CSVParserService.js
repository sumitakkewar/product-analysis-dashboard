import { parse } from 'csv-parse';
import { createReadStream, createWriteStream } from 'fs';

class CSVParserService {
  constructor() {
    this.parserOptions = {
      columns: true, // Use first line as headers
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
      relax_column_count: true
    };
  }

  async parseCSV(stream) {
    return new Promise((resolve, reject) => {
      const records = [];
      const parser = parse(this.parserOptions);

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });

      parser.on('error', (err) => {
        reject(err);
      });

      parser.on('end', () => {
        resolve(records);
      });

      stream.pipe(parser);
    });
  }

  async processCSVInBatches(filePath, batchSize, processBatch) {
    return new Promise((resolve, reject) => {
      const stream = createReadStream(filePath);
      const parser = parse(this.parserOptions);
      let currentBatch = [];
      let processedCount = 0;

      parser.on('readable', async () => {
        let record;
        while ((record = parser.read()) !== null) {
          currentBatch.push(record);
          processedCount++;

          if (currentBatch.length >= batchSize) {
            try {
              await processBatch(currentBatch, processedCount);
              currentBatch = [];
            } catch (error) {
              stream.destroy();
              parser.end();
              reject(error);
            }
          }
        }
      });

      parser.on('error', (err) => {
        reject(err);
      });

      parser.on('end', async () => {
        try {
          // Process any remaining records
          if (currentBatch.length > 0) {
            await processBatch(currentBatch, processedCount);
          }
          resolve(processedCount);
        } catch (error) {
          reject(error);
        }
      });

      stream.pipe(parser);
    });
  }

  async writeFailedRecords(failedRecords, filePath) {
    if (failedRecords.length === 0) return;

    const writeStream = createWriteStream(filePath);
    const parser = parse(this.parserOptions);

    // Write headers
    const headers = Object.keys(failedRecords[0]);
    writeStream.write(headers.join(',') + '\n');

    // Write records
    for (const record of failedRecords) {
      const values = headers.map(header => {
        const value = record[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      writeStream.write(values.join(',') + '\n');
    }

    writeStream.end();
    await new Promise(resolve => writeStream.on('finish', resolve));
  }
}

export default new CSVParserService(); 