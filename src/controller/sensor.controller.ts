import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SensorDataService } from '../service/sensor-data.service';
import { SensorDataResponse } from 'src/response/sensorData.interface';
import { SensorData } from 'src/model/sensor-data.model';
import { MqttService } from 'src/mqtt/mqtt.service';

@ApiTags('Sensor')
@Controller('SensorData')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}
  
  //get all plain data
  @Get('allPlain')
  @ApiOperation({ summary: 'Get all sensor data' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAllPlainData(): Promise<SensorData[]> {
    return this.sensorDataService.getAllPlainData();
  }
  
  // Get paginated, sorted, and filtered sensor data
  @Get()
  @ApiOperation({ summary: 'Get paginated, sorted, and filtered sensor data' })
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
    example: '2024',
  })
  @ApiQuery({
    name: 'field',
    required: false,
    description: 'Field to search in',
    example: 'createdAt',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getPaginatedSortedSensorData(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortField') sortField: string = 'createdAt', // Default sorting by createdAt
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC', // Default order is DESC
    @Query('search') search?: string, // Optional search query
    @Query('field') field?: string, // Optional field to search by
  ): Promise<SensorDataResponse> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { rows, count } = await this.sensorDataService.paginateAndSortSensorData(
      pageNumber,
      limitNumber,
      sortField,
      sortOrder,
      search,
      field,
    );

    return {
      columns: ['id', 'temperature', 'humidity', 'light', 'createdAt'],
      rows,
      count,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  // get all data that temperature higher than 30
  // @Get('temperature')
  // @ApiOperation({ summary: 'Get all sensor data that temperature higher than 30' })
  // @ApiResponse({ status: 200, description: 'Success' })
  // async getTemperatureHigherThan30(): Promise<{rows: SensorData[], count: number }> {
  //   return this.sensorDataService.getTemperatureHigherThan30();
  // }

  // get all data that humidity higher than 70
  // @Get('humidity')
  // @ApiOperation({ summary: 'Get all sensor data that humidity higher than 70' })
  // @ApiResponse({ status: 200, description: 'Success' })
  // async getHumidityHigherThan70(): Promise<{rows: SensorData[], count: number }> {
  //   return this.sensorDataService.getHumidityHigherThan70();
  // }

  
}