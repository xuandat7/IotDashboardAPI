import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SensorDataService } from '../service/sensor-data.service';
import { SensorDataResponse } from 'src/response/sensorData.interface';
import { SensorData } from 'src/model/sensor-data.model';

@ApiTags('Sensor')
@Controller('SensorData')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}
  //get all plain data
  @Get('all')
  @ApiOperation({ summary: 'Get all sensor data' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAllPlainData(): Promise<SensorData[]> {
    return this.sensorDataService.getAllPlainData();
  }
  
  // Get paginated, sorted, and filtered sensor data
  @Get()
  @ApiOperation({ summary: 'Get paginated, sorted, and filtered sensor data' })
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

  // Get paginated sensor data (only pagination)
  @Get('paginate')
  @ApiOperation({ summary: 'Get paginated sensor data' })
  @ApiResponse({ status: 200, description: 'Success' })
  async paginateSensorData(
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
      columns: ['id', 'temperature', 'humidity', 'light', 'createdAt'],
      rows,
      count,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  // Search sensor data with pagination
  @Get('search')
  @ApiOperation({ summary: 'Search sensor data with pagination' })
  @ApiResponse({ status: 200, description: 'Success' })
  async searchSensorData(
    @Query('query') query: string,
    @Query('field') field?: string, // Optional field to search by
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<SensorDataResponse> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { rows, count } = await this.sensorDataService.searchAndPaginateSensorData(
      query,
      field,
      pageNumber,
      limitNumber,
    );

    return {
      columns: ['id', 'temperature', 'humidity', 'light', 'createdAt'],
      rows,
      count,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  // Sort sensor data with pagination
  @Get('sort')
  @ApiOperation({ summary: 'Sort sensor data with pagination' })
  @ApiResponse({ status: 200, description: 'Success' })
  async sortSensorData(
    @Query('sortField') sortField: string = 'createdAt', // Default sorting by createdAt
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC', // Default order is DESC
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<SensorDataResponse> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { rows, count } = await this.sensorDataService.sortAndPaginateSensorData(
      sortField,
      sortOrder,
      pageNumber,
      limitNumber,
    );

    return {
      columns: ['id', 'temperature', 'humidity', 'light', 'createdAt'],
      rows,
      count,
      page: pageNumber,
      limit: limitNumber,
    };
  }
}
