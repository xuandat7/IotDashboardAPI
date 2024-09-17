import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SensorDataService } from '../service/sensor-data.service';
import { SensorData } from '../model/sensor-data.model';

@ApiTags('SensorData')
@Controller('sensor')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @ApiOperation({ summary: 'Get all sensor data' })
  @ApiResponse({ status: 200, description: 'All sensor data retrieved successfully' })
  @Get('all')
  async getAllData(): Promise<SensorData[]> {
    return await this.sensorDataService.getAllData();
  }

  @ApiOperation({ summary: 'Paginate sensor data' })
  @ApiResponse({ status: 200, description: 'Sensor data paginated successfully' })
  @Get('paginate')
  async paginateSensorData(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{ rows: SensorData[], count: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.sensorDataService.paginateSensorData(pageNumber, limitNumber);
  }

  @ApiOperation({ summary: 'Sort sensor data' })
  @ApiResponse({ status: 200, description: 'Sensor data sorted successfully' })
  @Get('sort')
  async sortSensorData(
    @Query('field') field: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ rows: SensorData[], count: number }> {
    return await this.sensorDataService.sortSensorData(field, order);
  }

  @ApiOperation({ summary: 'Search sensor data' })
  @ApiResponse({ status: 200, description: 'Sensor data searched successfully' })
  @Get('search')
  async searchSensorData(
    @Query('query') query: string,
    @Query('field') field?: string,
  ): Promise<SensorData[]> {
    return await this.sensorDataService.searchSensorData(query, field);
  }
}