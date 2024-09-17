import { Injectable } from '@nestjs/common';
import { FanLightLog } from 'src/model/fan-light-log.model';

@Injectable()
export class PaginationService {
  // Hàm phân trang dữ liệu
  async paginateFanLightLog(page: number, limit: number): Promise<{ rows: FanLightLog[]; count: number }> {
    const offset = (page - 1) * limit;

    const { rows, count } = await FanLightLog.findAndCountAll({
      offset,
      limit,
    });

    return { rows, count };
  }
}
