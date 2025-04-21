import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Customer = sequelize.define('Customer', {
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
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  address: {
    type: DataTypes.TEXT
  },
  latitude: {
    type: DataTypes.FLOAT,
    comment: 'double precision'
  },
  longitude: {
    type: DataTypes.FLOAT,
    comment: 'double precision'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'customer'
});

export default Customer; 