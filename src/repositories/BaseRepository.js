import { Op } from 'sequelize';

export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  async findOne(options = {}) {
    return this.model.findOne(options);
  }

  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    const instance = await this.findById(id);
    if (!instance) return null;
    return instance.update(data);
  }

  async delete(id) {
    const instance = await this.findById(id);
    if (!instance) return null;
    return instance.destroy();
  }

  async count(options = {}) {
    const count = await this.model.count(options);
    return count
  }

  async sum(field, options = {}) {
    const sum = await this.model.sum(field, options);
    return sum;
  }

  async average(field, options = {}) {
    const average = await this.model.average(field, options);
    return average
  }

  getDateRange(startDate, endDate) {
    return {
      date_of_sales: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    };
  }
} 