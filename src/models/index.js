import Customer from './Customer.js';
import Region from './Region.js';
import PaymentMethod from './PaymentMethod.js';
import Category from './Category.js';
import Product from './Product.js';
import Order from './Order.js';

// Set up relationships
Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

Order.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Order, { foreignKey: 'product_id' });

Order.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Order, { foreignKey: 'customer_id' });

Order.belongsTo(PaymentMethod, { foreignKey: 'payment_method_id' });
PaymentMethod.hasMany(Order, { foreignKey: 'payment_method_id' });

Order.belongsTo(Region, { foreignKey: 'region_id' });
Region.hasMany(Order, { foreignKey: 'region_id' });

export {
  Customer,
  Region,
  PaymentMethod,
  Category,
  Product,
  Order
}; 