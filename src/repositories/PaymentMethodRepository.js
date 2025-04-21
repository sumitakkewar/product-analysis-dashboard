import PaymentMethod from '../models/PaymentMethod.js';
import BaseRepository from './BaseRepository.js';

class PaymentMethodRepository extends BaseRepository {
  constructor() {
    super(PaymentMethod);
  }

  // Add any payment method-specific methods here
  async findActivePaymentMethods() {
    return await this.findAll({
      where: { active: true }
    });
  }

  async getPaymentMethodsWithOrders() {
    return await this.findAll({
      include: ['Order']
    });
  }
}

export default new PaymentMethodRepository(); 