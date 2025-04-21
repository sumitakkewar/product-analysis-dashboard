import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  external_id: {
    type: DataTypes.STRING,
    unique: true
  },
  name: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'category',
      key: 'id'
    }
  },
  active: {
    type: DataTypes.BOOLEAN
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'product'
});

export default Product; 