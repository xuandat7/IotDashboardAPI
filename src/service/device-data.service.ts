import { Injectable } from '@nestjs/common';
import { FanLightLog } from '../model/fan-light-log.model'; // Assuming the model path
import { Op, fn, col, where, literal } from 'sequelize';

@Injectable()
export class DeviceDataService {
  // Get all plain data
  async getAllPlainData(): Promise<any> {
    try {
      return await FanLightLog.findAll();
    } catch (error) {
      console.error('Error fetching fan light log data:', error);
      throw error;
    }
  }

  // Pagination only
  async paginateFanLightLogData(
    pageNumber: number,
    limitNumber: number,
  ): Promise<{ rows: FanLightLog[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * limitNumber;
      const { rows, count } = await FanLightLog.findAndCountAll({
        offset,
        limit: limitNumber,
      });
      return { rows, count };
    } catch (error) {
      console.error('Error during pagination:', error);
      throw error;
    }
  }

  // Search and pagination
  async searchAndPaginateFanLightLogData(
    query: string,
    field: string | undefined,
    pageNumber: number,
    limitNumber: number,
  ): Promise<{ rows: FanLightLog[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * limitNumber;
      let whereCondition;

      if (field) {
        whereCondition = {
          [field]: { [Op.like]: `%${query}%` },
        };
      } else {
        whereCondition = {
          [Op.or]: [
            { action: { [Op.like]: `%${query}%` } }, // Assuming there's an 'action' field
            { timestamp: { [Op.like]: `%${query}%` } },
          ],
        };
      }

      const { rows, count } = await FanLightLog.findAndCountAll({
        where: whereCondition,
        offset,
        limit: limitNumber,
      });

      return { rows, count };
    } catch (error) {
      console.error('Error during search and pagination:', error);
      throw error;
    }
  }

  // Sort and pagination
  async sortAndPaginateFanLightLogData(
    sortField: string,
    sortOrder: 'ASC' | 'DESC',
    pageNumber: number,
    limitNumber: number,
  ): Promise<{ rows: FanLightLog[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * limitNumber;
      const order = [[sortField, sortOrder]];

      const { rows, count } = await FanLightLog.findAndCountAll({
        order: order as any,
        offset,
        limit: limitNumber,
      });

      return { rows, count };
    } catch (error) {
      console.error('Error during sort and pagination:', error);
      throw error;
    }
  }

  // Combined pagination, sort, and search
  async paginateAndSortFanLightLogData(
    pageNumber: number,
    limitNumber: number,
    sortField: string,
    sortOrder: 'ASC' | 'DESC',
    search: string | undefined,
    field: string | undefined,
  ): Promise<{ rows: FanLightLog[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * limitNumber;
      let whereCondition: any = {};

      if (search) {
        if (field) {
          if (field === 'timestamp') {
            // Search on timestamp field
            whereCondition = where(
              fn(
                'DATE_FORMAT',
                fn('CONVERT_TZ', col('timestamp'), '+00:00', '+07:00'),
                '%Y-%m-%d %H:%i:%s',
              ),
              { [Op.like]: `%${search}%` },
            );
          } else {
            // Search on other fields
            whereCondition[field] = {
              [Op.like]: `%${search}%`,
            };
          }
        } else {
          // Search across multiple fields if field is not specified
          whereCondition[Op.or] = [
            { device: { [Op.like]: `%${search}%` } },
            { state: { [Op.like]: `%${search}%` } },
            where(
              fn(
                'DATE_FORMAT',
                fn('CONVERT_TZ', col('timestamp'), '+00:00', '+07:00'),
                '%Y-%m-%d %H:%i:%s',
              ),
              { [Op.like]: `%${search}%` },
            ),
          ];
        }
      }

      console.log('Query Parameters:', {
        sortField,
        sortOrder,
        pageNumber,
        limitNumber,
        search,
        field,
        whereCondition,
      });

      // Sorting logic
      const order =
        sortField === 'timestamp'
          ? [[literal(`CONVERT_TZ(timestamp, '+00:00', '+07:00')`), sortOrder]]
          : [[sortField, sortOrder]];

      // Querying the database with pagination, sorting, and search conditions
      const { rows, count } = await FanLightLog.findAndCountAll({
        where: whereCondition,
        order: order as any,
        offset,
        limit: limitNumber,
      });

      return { rows, count };
    } catch (error) {
      console.error('Error during pagination, sort, and search:', error);
      throw error;
    }
  }
}
