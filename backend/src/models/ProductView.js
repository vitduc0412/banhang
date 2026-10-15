const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductView = sequelize.define('ProductView', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sessionId: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'product_views',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['sessionId'] },
    { fields: ['productId'] }
  ]
});

module.exports = ProductView;
