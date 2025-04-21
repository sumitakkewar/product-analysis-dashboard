import Region from '../models/Region.js';
import BaseRepository from './BaseRepository.js';

class RegionRepository extends BaseRepository {
  constructor() {
    super(Region);
  }

  // Add any region-specific methods here
  async findActiveRegions() {
    return await this.findAll({
      where: { active: true }
    });
  }

  async getRegionsWithOrders() {
    return await this.findAll({
      include: ['Order']
    });
  }
}

export default new RegionRepository(); 