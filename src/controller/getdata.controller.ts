import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FanLightLog } from 'src/model/fan-light-log.model';
import { FanLightLogResponse } from '../response/actionHistory.interface';
import { DeviceDataService } from 'src/service/device-data.service';
@ApiTags('ActionHistory')
@Controller('GetDataAction')
export class GetDataActionController {
  constructor(private readonly deviceDataService: DeviceDataService) {}

  @ApiOperation({ summary: 'Get all history action data with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Fan light log data retrieved successfully',
  })
  @Get('allDataPaginate')
  async getFanLightLogData(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<FanLightLogResponse> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const { rows, count } = await this.deviceDataService.getFanLightLogData(pageNumber, limitNumber);
    return {
      columns: ["id", "device", "state", "timestamp"],
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