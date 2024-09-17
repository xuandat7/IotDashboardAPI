import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SensorDataService } from '../service/sensor-data.service';
import { SensorDataResponse } from 'src/response/sensorData.interface';
import { SensorData } from 'src/model/sensor-data.model';

@ApiTags('Sensor')
@Controller('SensorData')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  // Get all sensor data with pagination
  @Get()
  @ApiOperation({ summary: 'Get all sensor data' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAllSensorData(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<SensorDataResponse> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const { rows, count } = await this.sensorDataService.paginateSensorData(
      pageNumber,
      limitNumber,
    );
    return {
      columns: ['id', 'temperature', 'humidity', 'light', 'timestamp'],
      rows,
      count,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  // get all data
  @Get('allData')
  @ApiOperation({ summary: 'Get all sensor data' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAllData(): Promise<SensorData[]> {
    const rows = await this.sensorDataService.getAllData();
    return rows;
  }
}
