import { Injectable } from '@nestjs/common';
import { FanLightLog } from 'src/model/fan-light-log.model';

@Injectable()
export class SortService {
  // Hàm sắp xếp dữ liệu dựa trên trường và thứ tự
  async sortFanLightLog(sortField: string, sortOrder: 'ASC' | 'DESC'): Promise<FanLightLog[]> {
    return await FanLightLog.findAll({
      order: [[sortField, sortOrder]], // Sắp xếp theo trường và thứ tự
    });
  }
}
