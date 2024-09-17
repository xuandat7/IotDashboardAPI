import { Controller, Get, Query, Param } from '@nestjs/common';
import { DeviceDataService } from '../service/device-data.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FanLightLog } from 'src/model/fan-light-log.model';
import { FanLightLogResponse } from '../response/actionHistory.interface';

@ApiTags('ActionHistory')
@Controller('GetDataAction')
export class DeviceDataController {
  constructor(private readonly deviceDataService: DeviceDataService) {}

  //get all data
  @ApiOperation({ summary: 'Get all fan light log data' })
  @ApiResponse({
    status: 200,
    description: 'All data retrieved successfully',
  })
  @Get('fanlightlog/allData')
  async getAllData(): Promise<FanLightLog[]> {
    return await this.deviceDataService.getAllData();
  }

  // Pagination API
  @ApiOperation({ summary: 'Paginate fan light log data' })
  @ApiResponse({
    status: 200,
    description: 'Paginated data retrieved successfully',
  })
  @Get('fanlightlog/paginate')
  async paginateFanLightLog(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<FanLightLogResponse> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const { rows, count } = await this.deviceDataService.paginateFanLightLog(pageNumber, limitNumber);
    return {
      columns: ['id', 'device', 'state', 'timestamp'],
      rows,
      count,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  // Sorting API
  @ApiOperation({ summary: 'Sort fan light log data' })
  @ApiResponse({
    status: 200,
    description: 'Sorted data retrieved successfully',
  })
  @Get('fanlightlog/sort')
  async sortFanLightLog(
    @Query('sortField') sortField: string = 'timestamp',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ rows: FanLightLog[], count: number }> {
    const { rows, count } = await this.deviceDataService.sortFanLightLog(sortField, sortOrder);
    return {rows, count};
  }

  // Search API
  @ApiOperation({ summary: 'Search fan light log data' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  @Get('fanlightlog/search')
  async searchFanLightLog(
    @Query('query') query: string,
    @Query('field') field?: string, // Optional field to search by
  ): Promise<FanLightLog[]> {
    return await this.deviceDataService.searchFanLightLog(query, field);
  }
}
