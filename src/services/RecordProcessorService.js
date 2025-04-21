import { Customer, Product, Category, Region, PaymentMethod, Order } from '../models/index.js';

class RecordProcessorService {
  validateRecord(record) {

    const validCheck = [
      'Customer ID', 'Product ID', 'Order ID', 'Product Name','Category','Region','Date of Sale','Quantity Sold','Unit Price','Discount','Shipping Cost','Payment Method','Customer Name','Customer Email','Customer Address'
    ]

    if (!validCheck.every(item => !!record[item])) {
      throw new Error('Missing required fields');
    }
  }

  async processRecord(record, transaction) {

    console.log('record', record)

    // Check and get Category
    const [category] = await Category.findOrCreate({
      where: { name: record['Category'] },
      defaults: { active: true },
      transaction
    });

    // Check and get Region
    const [region] = await Region.findOrCreate({
      where: { name: record['Region'] },
      defaults: { active: true },
      transaction
    });

    // Check and get Payment Method
    const [paymentMethod] = await PaymentMethod.findOrCreate({
      where: { name: record['Payment Method'] },
      defaults: { active: true },
      transaction
    });

    // Check and get Customer
    const [customer] = await Customer.findOrCreate({
      where: { email: record['Customer Email'] },
      defaults: {
        name: record['Customer Name'],
        external_id: record['Customer ID'],
        address: record['Customer Address'],
        active: true
      },
      transaction
    });

    // Check and get Product
    const [product] = await Product.findOrCreate({
      where: { external_id: record['Product ID'] },
      defaults: {
        name: record['Product Name'],
        price: parseFloat(record['Unit Price']),
        category_id: category.id,
        active: true
      },
      transaction
    });

    let actualCost = parseFloat(record['Unit Price']) * parseInt(record['Quantity Sold'])
    let orderCost = actualCost - (actualCost * parseFloat(record['Discount']))
    orderCost = orderCost + parseFloat(record['Shipping Cost'])

    // Check and get Order
    await Order.findOrCreate({
      where: { external_id: record['Order ID'] },
      defaults: {
        product_id: product.id,
        customer_id: customer.id,
        payment_method_id: paymentMethod.id,
        region_id: region.id,
        discount: parseFloat(record['Discount']),
        shipping_cost: parseFloat(record['Shipping Cost']),
        quantity: parseInt(record['Quantity Sold']),
        date_of_sales: new Date(record['Date of Sale']),
        total_cost: parseFloat(orderCost),
        actual_cost: actualCost
      },
      transaction
    });

  }
}

export default new RecordProcessorService(); 