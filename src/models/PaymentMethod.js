import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true
  },
  active: {
    type: DataTypes.BOOLEAN
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'payment_method'
});

export default PaymentMethod; 