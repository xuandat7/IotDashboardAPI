import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { FanLightLog } from 'src/model/fan-light-log.model';

@Injectable()
export class DeviceDataService {

  // Pagination service
  async getAllData(){
    return await FanLightLog.findAll();
  }

  async paginateFanLightLog(pageNumber: number, limitNumber: number): Promise<{ rows: FanLightLog[], count: number }> {
    const offset = (pageNumber - 1) * limitNumber;
    const { rows, count } = await FanLightLog.findAndCountAll({
      offset,
      limit: limitNumber,
    });
    return { rows, count };
  }

  // Sorting service
  async sortFanLightLog(sortField: string, sortOrder: 'ASC' | 'DESC'): Promise<{ rows: FanLightLog[], count: number }> {
    
    const { rows, count  } = await FanLightLog.findAndCountAll({

      order: [[sortField, sortOrder]],

    });
    return {rows, count};
  }

  // Search service
  async searchFanLightLog(query: string, field?: string): Promise<FanLightLog[]> {
    let whereCondition;

    if (field) {
      // If a specific field is provided, search by that field
      whereCondition = {
        [field]: {
          [Op.like]: `%${query}%`,
        },
      };
    } else {
      // Search across all fields (device, state, timestamp)
      whereCondition = {
        [Op.or]: [
          { device: { [Op.like]: `%${query}%` } },
          { state: { [Op.like]: `%${query}%` } },
          { timestamp: { [Op.like]: `%${query}%` } }, // assuming timestamp can be searched as string
        ],
      };
    }

    const logs = await FanLightLog.findAll({
      where: whereCondition,
    });
    return logs;
  }
}
