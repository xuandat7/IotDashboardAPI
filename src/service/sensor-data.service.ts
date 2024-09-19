import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { SensorData } from '../model/sensor-data.model';

@Injectable()
export class SensorDataService {
  //get all plain data
  async getAllPlainData(): Promise<any> {
    try {
      return await SensorData.findAll();
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }

  // Lấy tất cả dữ liệu cảm biến với phân trang
  async paginateSensorData(
    pageNumber: number,
    limitNumber: number
  ): Promise<{ rows: SensorData[], count: number }> {
    const offset = (pageNumber - 1) * limitNumber;
    const { rows, count } = await SensorData.findAndCountAll({
      offset,
      limit: limitNumber,
    });
    return { rows, count };
  }

  // Tìm kiếm và phân trang
  async searchAndPaginateSensorData(
    query: string,
    field: string | undefined,
    pageNumber: number,
    limitNumber: number,
  ): Promise<{ rows: SensorData[], count: number }> {
    const offset = (pageNumber - 1) * limitNumber;

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

    const { rows, count } = await SensorData.findAndCountAll({
      where: whereCondition,
      offset,
      limit: limitNumber,
    });

    return { rows, count };
  }

  // Sắp xếp và phân trang
  async sortAndPaginateSensorData(
    sortField: string,
    sortOrder: 'ASC' | 'DESC',
    pageNumber: number,
    limitNumber: number,
  ): Promise<{ rows: SensorData[], count: number }> {
    const offset = (pageNumber - 1) * limitNumber;

    const { rows, count } = await SensorData.findAndCountAll({
      order: [[sortField, sortOrder]],
      offset,
      limit: limitNumber,
    });

    return { rows, count };
  }

  // Kết hợp phân trang, sắp xếp và tìm kiếm
  async paginateAndSortSensorData(
    pageNumber: number,
    limitNumber: number,
    sortField: string,
    sortOrder: 'ASC' | 'DESC',
    search: string | undefined,
    field: string | undefined,
  ): Promise<{ rows: SensorData[], count: number }> {
    const offset = (pageNumber - 1) * limitNumber;

    let whereCondition;
    if (search) {
      if (field) {
        whereCondition = {
          [field]: {
            [Op.like]: `%${search}%`,
          },
        };
      } else {
        whereCondition = {
          [Op.or]: [
            { temperature: { [Op.like]: `%${search}%` } },
            { humidity: { [Op.like]: `%${search}%` } },
            { light: { [Op.like]: `%${search}%` } },
            { createdAt: { [Op.like]: `%${search}%` } },
          ],
        };
      }
    }

    const { rows, count } = await SensorData.findAndCountAll({
      where: whereCondition,
      order: [[sortField, sortOrder]],
      offset,
      limit: limitNumber,
    });

    return { rows, count };
  }
}
