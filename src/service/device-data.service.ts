import { Injectable } from '@nestjs/common';
import { FanLightLog } from '../model/fan-light-log.model'; // Assuming the model path
import { Op } from 'sequelize';

@Injectable()
export class DeviceDataService {
  // Service method to get fan and light log data with pagination
  //get all plain data
  async getAllPlainData(): Promise<any> {
    try {
      return await FanLightLog.findAll();
    } catch (error) {
      console.error('Error fetching fan light log data:', error);
      throw error;
    }
  }

  async getFanLightLogData(
    page: number,
    limit: number,
  ): Promise<{ rows: FanLightLog[]; count: number }> {
    try {
      const offset = (page - 1) * limit;
      const { rows, count } = await FanLightLog.findAndCountAll({
        offset,
        limit,
      });
      return { rows, count };
    } catch (error) {
      console.error('Error fetching fan light log data:', error);
      throw error;
    }
  }
}
