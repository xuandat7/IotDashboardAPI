import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FanLightLog } from 'src/model/fan-light-log.model';
import { FanLightLogResponse } from '../response/actionHistory.interface';

@ApiTags('ActionHistory')
@Controller('GetDataAction')
export class GetDataActionController {
  constructor(private readonly mqttService: MqttService) {}

  @ApiOperation({ summary: 'Get all history action data' })
  @ApiResponse({
    status: 200,
    description: 'Fan light log data retrieved successfully',
  })
  @Get('fanlightlog')
  async getFanLightLogData(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<FanLightLogResponse> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const { rows, count } = await this.mqttService.getFanLightLogData(pageNumber, limitNumber);
    return {
      columns: ["id", "device", "state", "timestamp"],
      rows,
      count,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  //get all action data by name
  @ApiOperation({ summary: 'Get history action data by device' })
  @ApiResponse({
    status: 200,
    description: 'Fan light log data retrieved successfully',
  })
  @Get('fanlightlog/:device')
  async getFanLightLogDataByDevice(
    @Param('device') device: string,
  ): Promise<FanLightLog[]> {
    return await this.mqttService.getFanLightLogDataByDevice(device);
  }

  //get all action data by time
  @ApiOperation({ summary: 'Get history action data by date range' })
  @ApiResponse({
    status: 200,
    description: 'Fan light log data retrieved successfully',
  })
  @ApiParam({
    name: 'from',
    description: 'Start date',
    type: 'string',
    format: 'date',
  })
  @ApiParam({
    name: 'to',
    description: 'End date',
    type: 'string',
    format: 'date',
  })
  @Get(':from/:to')
  async getFanLightLogDataByTime(
    @Param('from') from: string, // Nhận từ người dùng dưới dạng chuỗi
    @Param('to') to: string, // Nhận từ người dùng dưới dạng chuỗi
  ): Promise<FanLightLog[]> {
    const startDate = new Date(from); // Chuyển chuỗi thành kiểu Date
    const endDate = new Date(to); // Chuyển chuỗi thành kiểu Date
    return await this.mqttService.getFanLightLogDataByTime(startDate, endDate);
  }

  // get data by id
  @ApiOperation({ summary: 'Get fan light log data by id' })
  @ApiResponse({
    status: 200,
    description: 'Fan light log data retrieved successfully',
  })
  @Get('fanlightlog/id/:id')
  async getFanLightLogById(@Param('id') id: number): Promise<FanLightLog> {
    return await this.mqttService.getFanLightLogById(id);
  }
}