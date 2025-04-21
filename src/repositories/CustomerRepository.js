import Customer from '../models/Customer.js';
import BaseRepository from './BaseRepository.js';

class CustomerRepository extends BaseRepository {
  constructor() {
    super(Customer);
  }

  // Add any customer-specific methods here
  async findByEmail(email) {
    return await this.findOne({
      where: { email }
    });
  }

  async findActiveCustomers() {
    return await this.findAll({
      where: { active: true }
    });
  }
}

export default new CustomerRepository(); 