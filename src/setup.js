import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const setupDatabase = async () => {
  try {
    // Read the SQL file
    const sqlFile = join(__dirname, '../dump/product_dashboard.sql');
    const sql = readFileSync(sqlFile, 'utf8');

    // Execute the SQL commands
    await sequelize.authenticate();
    await sequelize.query(sql);
    console.log('Database schema created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase(); 