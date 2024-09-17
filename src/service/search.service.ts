import { Injectable } from '@nestjs/common';
import { FanLightLog } from 'src/model/fan-light-log.model';
import { Op } from 'sequelize';

@Injectable()
export class SearchService {
  // Hàm tìm kiếm theo device và state với searchTerm
  async searchFanLightLog(searchTerm: string): Promise<FanLightLog[]> {
    const whereClause = searchTerm
      ? {
          [Op.or]: [
            { device: { [Op.like]: `%${searchTerm}%` } },
            { state: { [Op.like]: `%${searchTerm}%` } },
          ],
        }
      : {};

    return await FanLightLog.findAll({
      where: whereClause,
    });
  }
}
