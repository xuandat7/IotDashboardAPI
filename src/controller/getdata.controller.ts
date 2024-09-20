import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FanLightLog } from 'src/model/fan-light-log.model';
import { FanLightLogResponse } from '../response/actionHistory.interface';
import { DeviceDataService } from 'src/service/device-data.service';
@ApiTags('ActionHistory')
@Controller('GetDataAction')
export class GetDataActionController {
  constructor(private readonly deviceDataService: DeviceDataService) {}

  @ApiOperation({
    summary: 'Get all history action data with pagination, sorting, and search',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (ASC or DESC)',
    example: 'ASC',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search query',
    example: 'on',
  })
  @ApiQuery({
    name: 'field',
    required: false,
    description: 'Field to search in',
    example: 'state',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fan light log data retrieved successfully with pagination, sorting, and search',
  })
  @Get('allDataPaginate')
  async getFanLightLogData(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortField') sortField: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
    @Query('field') field?: string,
  ): Promise<FanLightLogResponse> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { rows, count } =
      await this.deviceDataService.paginateAndSortFanLightLogData(
        pageNumber,
        limitNumber,
        sortField,
        sortOrder,
        search,
        field,
      );

    return {
      columns: ['id', 'device', 'state', 'timestamp'],
      rows,
      count,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  //get all plain data
  @ApiOperation({ summary: 'Get all plain data' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('allData')
  async getAllPlainData(): Promise<FanLightLog[]> {
    return await this.deviceDataService.getAllPlainData();
  }
}
