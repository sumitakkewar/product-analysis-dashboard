import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
  constructor() {
    const isTestEnvironment = process.env.NODE_ENV === 'test';

    this.sequelize = isTestEnvironment 
      ? new Sequelize({
          dialect: 'sqlite',
          storage: path.join(__dirname, '../../test.sqlite'),
          logging: false,
          define: {
            timestamps: true,
            underscored: true
          }
        })
      : new Sequelize({
          dialect: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          database: process.env.DB_NAME || 'product_dashboard',
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          pool: {
            max: 10, // Maximum number of connections in pool
            min: 0,  // Minimum number of connections in pool
            acquire: 30000, // Maximum time to acquire a connection
            idle: 10000, // Maximum time a connection can be idle
            evict: 1000, // How often to check for idle connections
          },
          logging: false,
          define: {
            timestamps: true,
            underscored: true
          }
        });
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  getInstance() {
    return this.sequelize;
  }
}

export const database = new Database();
export const sequelize = database.getInstance(); 