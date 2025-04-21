import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  external_id: {
    type: DataTypes.STRING,
    unique: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'product',
      key: 'id'
    }
  },
  customer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'customer',
      key: 'id'
    }
  },
  payment_method_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'payment_method',
      key: 'id'
    }
  },
  region_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'region',
      key: 'id'
    }
  },
  discount: {
    type: DataTypes.FLOAT
  },
  shipping_cost: {
    type: DataTypes.FLOAT
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  date_of_sales: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total_cost: {
    type: DataTypes.FLOAT
  },
  actual_cost: {
    type: DataTypes.FLOAT
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'order'
});

export default Order; 