import { Injectable } from '@nestjs/common';
import { Op, fn, col, where, literal } from 'sequelize';
import { SensorData } from '../model/sensor-data.model';
import * as moment from 'moment-timezone';

@Injectable()
export class SensorDataService {
  // Get all plain data
  async getAllPlainData(): Promise<any> {
    try {
      return await SensorData.findAll();
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }

  // Pagination only
  async paginateSensorData(
    pageNumber: number,
    limitNumber: number,
  ): Promise<{ rows: SensorData[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * limitNumber;
      const { rows, count } = await SensorData.findAndCountAll({
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
  async searchAndPaginateSensorData(
    query: string,
    field: string | undefined,
    pageNumber: number,
    limitNumber: number,
  ): Promise<{ rows: SensorData[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * limitNumber;

      let whereCondition;
      if (field) {
        if (field === 'createdAt') {
          whereCondition = where(
            fn(
              'DATE_FORMAT',
              fn('CONVERT_TZ', col('createdAt'), '+00:00', '+07:00'),
              '%Y-%m-%d %H:%i:%s',
            ),
            { [Op.like]: `%${query}%` },
          );
        } else {
          whereCondition = {
            [field]: {
              [Op.like]: `%${query}%`,
            },
          };
        }
      } else {
        whereCondition = {
          [Op.or]: [
            { temperature: { [Op.like]: `%${query}%` } },
            { humidity: { [Op.like]: `%${query}%` } },
            { light: { [Op.like]: `%${query}%` } },
            where(
              fn(
                'DATE_FORMAT',
                fn('CONVERT_TZ', col('createdAt'), '+00:00', '+07:00'),
                '%Y-%m-%d %H:%i:%s',
              ),
              { [Op.like]: `%${query}%` },
            ),
          ],
        };
      }

      const { rows, count } = await SensorData.findAndCountAll({
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
  async sortAndPaginateSensorData(
    sortField: string,
    sortOrder: 'ASC' | 'DESC',
    pageNumber: number,
    limitNumber: number,
  ): Promise<{ rows: SensorData[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * limitNumber;

      const order =
        sortField === 'createdAt'
          ? [[literal(`CONVERT_TZ(createdAt, '+00:00', '+07:00')`), sortOrder]]
          : [[sortField, sortOrder]];

      const { rows, count } = await SensorData.findAndCountAll({
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
  async paginateAndSortSensorData(
    pageNumber: number,
    limitNumber: number,
    sortField: string,
    sortOrder: 'ASC' | 'DESC',
    search: string | undefined,
    field: string | undefined,
  ): Promise<{ rows: SensorData[]; count: number }> {
    try {
      const offset = (pageNumber - 1) * limitNumber;
      let whereCondition: any = {};

      if (search) {
        if (field) {
          if (field === 'createdAt') {
            whereCondition = where(
              fn(
                'DATE_FORMAT',
                fn('CONVERT_TZ', col('createdAt'), '+00:00', '+07:00'),
                '%Y-%m-%d %H:%i:%s',
              ),
              { [Op.like]: `%${search}%` },
            );
          } else {
            whereCondition[field] = {
              [Op.like]: `%${search}%`,
            };
          }
        } else {
          whereCondition[Op.or] = [
            { temperature: { [Op.like]: `%${search}%` } },
            { humidity: { [Op.like]: `%${search}%` } },
            { light: { [Op.like]: `%${search}%` } },
            where(
              fn(
                'DATE_FORMAT',
                fn('CONVERT_TZ', col('createdAt'), '+00:00', '+07:00'),
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

      const order =
        sortField === 'createdAt'
          ? [[literal(`CONVERT_TZ(createdAt, '+00:00', '+07:00')`), sortOrder]]
          : [[sortField, sortOrder]];

      const { rows, count } = await SensorData.findAndCountAll({
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
