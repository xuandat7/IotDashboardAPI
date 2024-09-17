import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { SensorData } from '../model/sensor-data.model';

@Injectable()
export class SensorDataService {
  async getAllData() {
    return await SensorData.findAll();
  }

  async paginateSensorData(pageNumber: number, limitNumber: number): Promise<{ rows: SensorData[], count: number }> {
    const offset = (pageNumber - 1) * limitNumber;
    const { rows, count } = await SensorData.findAndCountAll({
      offset,
      limit: limitNumber,
    });
    return { rows, count };
  }

  async sortSensorData(sortField: string, sortOrder: 'ASC' | 'DESC'): Promise<{ rows: SensorData[], count: number }> {
    const { rows, count } = await SensorData.findAndCountAll({
      order: [[sortField, sortOrder]],
    });
    return { rows, count };
  }

  async searchSensorData(query: string, field?: string): Promise<SensorData[]> {
    let whereCondition;

    if (field) {
      whereCondition = {
        [field]: {
          [Op.like]: `%${query}%`,
        },
      };
    } else {
      whereCondition = {
        [Op.or]: [
          { temperature: { [Op.like]: `%${query}%` } },
          { humidity: { [Op.like]: `%${query}%` } },
          { light: { [Op.like]: `%${query}%` } },
          { createdAt: { [Op.like]: `%${query}%` } },
        ],
      };
    }

    const logs = await SensorData.findAll({
      where: whereCondition,
    });
    return logs;
  }
}


